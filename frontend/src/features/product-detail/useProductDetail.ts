import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/api";

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId, // Solo ejecutar si hay productId
  });
}