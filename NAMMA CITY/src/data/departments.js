export const departments = [
  {
    id: "waste_management",
    nameKey: "waste_management",
    icon: "Trash2",
    contact: "044-25384520",
    email: "solidwaste@chennaicorporation.gov.in",
    categories: ["garbage"],
    slaHours: 24,
    color: "emerald"
  },
  {
    id: "roads_highways",
    nameKey: "roads_highways",
    icon: "Hammer",
    contact: "044-25619223",
    email: "roads@chennaicorporation.gov.in",
    categories: ["pothole", "damaged_road"],
    slaHours: 48,
    color: "amber"
  },
  {
    id: "electricity",
    nameKey: "electricity",
    icon: "Lightbulb",
    contact: "044-28520131",
    email: "streetlights@tangedco.gov.in",
    categories: ["streetlight"],
    slaHours: 24,
    color: "yellow"
  },
  {
    id: "water_supply",
    nameKey: "water_supply",
    icon: "Droplets",
    contact: "044-45674567",
    email: "cmwssb@metrowater.in",
    categories: ["water_leakage"],
    slaHours: 36,
    color: "blue"
  },
  {
    id: "drainage",
    nameKey: "drainage",
    icon: "Waves",
    contact: "044-25381111",
    email: "drainage@chennaicorporation.gov.in",
    categories: ["drainage"],
    slaHours: 48,
    color: "cyan"
  },
  {
    id: "environmental",
    nameKey: "environmental",
    icon: "Trees",
    contact: "044-25619333",
    email: "greenery@chennaicorporation.gov.in",
    categories: ["environmental"],
    slaHours: 72,
    color: "teal"
  },
  {
    id: "municipal_corp",
    nameKey: "municipal_corp",
    icon: "Building2",
    contact: "044-1913",
    email: "commissioner@chennaicorporation.gov.in",
    categories: ["other"],
    slaHours: 72,
    color: "indigo"
  }
];

export const getDepartmentByCategory = (categoryId) => {
  const dept = departments.find(d => d.categories.includes(categoryId));
  return dept || departments[departments.length - 1];
};
