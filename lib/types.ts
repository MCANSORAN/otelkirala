export type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
};

export type Destination = {
  id: string;
  name: string;
  hotelCount: number;
  image: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
};
