import { CarProps, FilterProps } from "@/types";

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, model, fuel, year } = filters;

  const searchYear = year || 2022;

  const headers = {
    "X-RapidAPI-Key": "466147bbd9msh857fe8591f37d75p19dc06jsna32bcdaf623a",
    "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
  };

  const queryParams = new URLSearchParams();

  queryParams.append("model", model);

  if (manufacturer) queryParams.append("make", manufacturer);
  if (year) queryParams.append("year", searchYear.toString());
  if (fuel) queryParams.append("fuel_type", fuel);

  const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${queryParams.toString()}`;

  try {
    console.log(`Fetching cars with URL: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API responded with status ${response.status}: ${errorText}`
      );
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log(`Received ${result.length} cars from API`);

    return result;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return {
      message:
        "Failed to fetch cars. Please check your search parameters and try again.",
    };
  }
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");

  const { make, year, model } = car;

  url.searchParams.append("customer", "img");
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", `${angle}`);

  return `${url}`;
};

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};
