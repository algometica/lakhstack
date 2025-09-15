import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Trash2, Loader } from 'lucide-react'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'

function FileUpload({ setImages, imageList, onImageDeleted }) {

    const [imagePreview, setImagePreview] = useState([]);
    const [deletingImageId, setDeletingImageId] = useState(null);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        console.log(files);
        setImages(files)

        const previews = Array.from(files).map((file) => URL.createObjectURL(file));
        setImagePreview(previews);
    }

    const handleDeleteImage = async (imageId, imageUrl) => {
        setDeletingImageId(imageId);
        
        try {
            // Extract filename from URL for storage deletion
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            
            // Delete from Supabase storage
            const { error: storageError } = await supabase.storage
                .from('listing_images')
                .remove([fileName]);
            
            if (storageError) {
                console.error('Storage deletion error:', storageError);
                toast.error('Failed to delete image from storage');
                return;
            }
            
            // Delete from database
            const { error: dbError } = await supabase
                .from('listing_images')
                .delete()
                .eq('id', imageId);
            
            if (dbError) {
                console.error('Database deletion error:', dbError);
                toast.error('Failed to delete image from database');
                return;
            }
            
            toast.success('Image deleted successfully');
            
            // Notify parent component to refresh the listing data
            if (onImageDeleted) {
                onImageDeleted();
            }
            
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        } finally {
            setDeletingImageId(null);
        }
    }

    const removePreviewImage = (index) => {
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        setImagePreview(newPreviews);
        
        // Also update the files array
        const fileInput = document.getElementById('dropzone-file');
        if (fileInput && 'files' in fileInput && fileInput.files) {
            const currentFiles = Array.from(fileInput.files);
            const newFiles = currentFiles.filter((_, i) => i !== index);
            
            // Create a new FileList-like object
            const dt = new DataTransfer();
            newFiles.forEach(file => dt.items.add(file));
            fileInput.files = dt.files;
            
            setImages(dt.files);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file"
                        multiple className="hidden"
                        onChange={handleFileUpload}
                        accept="image/png, image/gif, image/jpeg"
                    />
                </label>
            </div>

            {/* Preview Images */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 mt-3'>
                {imagePreview.map((image, index) => (
                    <div key={index} className="relative group">
                        <Image src={image} width={100} height={100}
                            className='rounded-lg object-cover h-[100px] w-[100px]'
                            alt={`Preview image ${index + 1}`}
                        />
                        <button
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center"
                            onClick={() => removePreviewImage(index)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Existing Images */}
            {imageList && imageList.length > 0 &&
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 mt-3'>
                    {imageList.map((image, index) => (
                        <div key={image.id || index} className="relative group">
                            <Image src={image?.url} width={100} height={100}
                                className='rounded-lg object-cover h-[100px] w-[100px]'
                                alt={`Listing image ${index + 1}`}
                            />
                            <button
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center disabled:opacity-50"
                                disabled={deletingImageId === image.id}
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
                                        handleDeleteImage(image.id, image.url);
                                    }
                                }}
                            >
                                {deletingImageId === image.id ? (
                                    <Loader className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3 w-3" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default FileUpload