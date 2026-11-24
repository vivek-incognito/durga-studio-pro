import { queryOptions } from "@tanstack/react-query";
import { getProduct, listBranches, listGallery, listProducts } from "./public-data.functions";

export const productsQuery = () =>
  queryOptions({ queryKey: ["products"], queryFn: () => listProducts(), staleTime: 60_000 });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }), staleTime: 60_000 });

export const branchesQuery = () =>
  queryOptions({ queryKey: ["branches"], queryFn: () => listBranches(), staleTime: 60_000 });

export const galleryQuery = () =>
  queryOptions({ queryKey: ["gallery"], queryFn: () => listGallery(), staleTime: 60_000 });

export type PublicProduct = Awaited<ReturnType<typeof listProducts>>[number];
export type PublicBranch = Awaited<ReturnType<typeof listBranches>>[number];
export type PublicGalleryImage = Awaited<ReturnType<typeof listGallery>>[number];
