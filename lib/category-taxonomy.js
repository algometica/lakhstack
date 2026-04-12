const CATEGORY_OPTIONS = [
  {
    value: "photography-film",
    label: "Photography and Film",
    description: "weddings, videography, drone, documentary",
  },
  {
    value: "catering-food-desserts",
    label: "Catering, Food and Desserts",
    description: "South Asian, fusion, halal, Jain, desserts",
  },
  {
    value: "decor-florals",
    label: "Decor and Florals",
    description: "mandap design, draping, florals, lighting",
  },
  {
    value: "music-entertainment",
    label: "Music and Entertainment",
    description: "DJs, dhol, live bands, Bollywood, MCs",
  },
  {
    value: "hair-makeup-mehndi",
    label: "Hair, Makeup and Mehndi",
    description: "bridal MUA, mehndi, hair styling, groom prep",
  },
  {
    value: "event-planning-coordination",
    label: "Event Planning and Coordination",
    description: "full service, day of coordination, design",
  },
  {
    value: "venues-spaces",
    label: "Venues and Spaces",
    description: "banquet halls, gardens, hotels, gurdwaras, mandirs",
  },
  {
    value: "bridal-attire-jewelry",
    label: "Bridal Attire and Jewelry",
    description: "lehenga, sherwani, jewelry, custom design",
  },
  {
    value: "invitations-stationery",
    label: "Invitations and Stationery",
    description: "custom print, digital invites, calligraphy, favors",
  },
  {
    value: "transport-baraat",
    label: "Transport and Baraat",
    description: "luxury cars, ghodi, limo, shuttles",
  },
  {
    value: "event-services-support",
    label: "Event Services and Support",
    description:
      "child minding, pet care, gifts, cleaning, errands, setup, translation",
  },
];

const CATEGORY_LABELS = CATEGORY_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const getCategoryLabel = (value) => CATEGORY_LABELS[value] || null;

const getListingCategoryLabel = (listing = {}) => {
  return getCategoryLabel(listing?.category) || "Uncategorized";
};

export {
  CATEGORY_OPTIONS,
  CATEGORY_LABELS,
  getCategoryLabel,
  getListingCategoryLabel,
};
