import { useRouter } from 'next/router'
import SellerListSingle from '~/components/seller/SellerListSingle';

export default function Page() {
  const router = useRouter()
  return (
      <SellerListSingle />
  );
}