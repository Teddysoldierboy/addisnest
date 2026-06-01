import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LegacyEditRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/admin/listings/${id}/edit`);
}
