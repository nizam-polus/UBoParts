import { useRouter } from 'next/router'
import Productsingle from '~/components/product-single_/Productsingle'
 
export default function Page() {
  const router = useRouter()
  return (
      <Productsingle />
  );
}