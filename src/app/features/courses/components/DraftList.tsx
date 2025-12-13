"use client";

import { useCourseDraftStore } from '@/store/courseDraftStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';

export function DraftList() {
  const router = useRouter();
  const { drafts, loadDraft, deleteDraft } = useCourseDraftStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  const handleLoadDraft = (draftId: string) => {
    loadDraft(draftId);
    router.push('/courses/add');
  };

  const handleDeleteClick = (draftId: string) => {
    setDraftToDelete(draftId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (draftToDelete) {
      deleteDraft(draftToDelete);
      setDeleteDialogOpen(false);
      setDraftToDelete(null);
    }
  };

  if (drafts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Draft Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="p-6 bg-white border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Draft
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(draft.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 truncate">
                {draft.overview.courseName || 'Untitled Course'}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {draft.overview.headingDescription || 'No description yet'}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Clock className="h-3 w-3" />
                <span>
                  Last edited {formatDistanceToNow(new Date(draft.lastModified), { addSuffix: true })}
                </span>
              </div>

              <Button
                onClick={() => handleLoadDraft(draft.id)}
                className="w-full bg-gray-900 hover:bg-gray-800"
                size="sm"
              >
                Continue Editing
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Draft</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}