import { useRouter } from 'next/router'
import EditListing from '~/components/seller/EditListing';

export default function Page() {
  const router = useRouter()
  return (
      <EditListing />
  );
}