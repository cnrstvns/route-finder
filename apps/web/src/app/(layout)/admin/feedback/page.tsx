import { listFeedback } from '@/api/server/feedback';
import { Header } from '@/components/navigation/header';
import { PageTitle } from '@/components/ui/page-title';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dayjs } from '@/lib/time';
import { PaginatedWithQuery } from '@/types/search';
import { headers } from 'next/headers';
import Image from 'next/image';

export default async function Feedback({ searchParams }: PaginatedWithQuery) {
  const { data: feedback } = await listFeedback(searchParams, { headers: headers() });

  return (
    <div>
      <Header searchPlaceholder="Search for feedback..." profile />

      <PageTitle
        title="Feedback"
        subtitle="List of user feedback and profile information."
        header
      />

      <div className="overflow-auto w-screen md:w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {feedback.data.map((userFeedback) => (
              <TableRow key={userFeedback.id}>
                <TableCell>
                  <div className="flex space-x-3">
                    <Image
                      src={userFeedback.profilePictureUrl || ''}
                      height={40}
                      width={40}
                      alt={userFeedback.userName}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="text-neutral-700 dark:text-zinc-300 font-medium">
                        {userFeedback.userName}
                      </div>
                      <div className="text-neutral-600 dark:text-zinc-400">
                        {userFeedback.emailAddress}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{userFeedback.feedbackText}</TableCell>
                <TableCell>{dayjs(userFeedback.createdAt).fromNow()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination totalCount={feedback.pagination.totalCount} resource="feedback" />
    </div>
  );
}
