export const createCursor = (size: number) => {
  const coof = 1.2
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size * coof}px' height='${size * coof}px' viewBox='0 0 120 120' style='stroke: black; stroke-width: 3;' fill='%2300000000' %3E %3Ccircle cx='51' cy='51' r='50'/%3E %3C/svg%3E") ${size/2} ${size/2}, auto`
}