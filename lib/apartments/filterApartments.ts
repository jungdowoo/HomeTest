import { sampleApartments } from "./sampleApartments";
import type { ApartmentOffering } from "./types";

export function getRegions(apartments: ApartmentOffering[] = sampleApartments) {
  return Array.from(new Set(apartments.map((apartment) => apartment.region)));
}

export function getDistricts(region: string, apartments: ApartmentOffering[] = sampleApartments) {
  return Array.from(
    new Set(apartments.filter((apartment) => apartment.region === region).map((apartment) => apartment.district)),
  );
}

export function filterApartments(region: string, district: string, apartments: ApartmentOffering[] = sampleApartments) {
  return apartments.filter((apartment) => apartment.region === region && apartment.district === district);
}

export function findApartment(apartmentId: string, apartments: ApartmentOffering[] = sampleApartments) {
  return apartments.find((apartment) => apartment.apartmentId === apartmentId) ?? null;
}
