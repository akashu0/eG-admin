import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, useCourseStore } from "@/store/courseStore";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { CourseQueryParams, courseService } from "../services/courseService";

export const useCourses = (initialParams: CourseQueryParams = {}) => {
  const queryClient = useQueryClient();
  const { setCourses, deleteCourse: deleteFromStore } = useCourseStore();

  const [queryParams, setQueryParams] = useState<CourseQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["courses", queryParams],
    queryFn: async () => {
      const response = await courseService.getAllCourses(queryParams);
      // Extract courses from the nested structure
      const courses = response.courses || [];
      const pagination = response.pagination;

      setCourses(courses, pagination);
      return { courses, pagination };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: (_, id) => {
      deleteFromStore(id);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete course");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated successfully");
    },
    onError: () => {
      toast.error("Failed to update course");
    },
  });

  // Use useCallback to prevent recreating functions on every render
  const goToPage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    setQueryParams((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setQueryParams((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Partial<CourseQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...filters, page: 1 }));
  }, []);

  return {
    courses: data?.courses || [],
    pagination: data?.pagination || null,
    isLoading,
    isFetching,
    error,
    queryParams,

    // Actions
    deleteCourse: deleteMutation.mutate,
    updateCourse: updateMutation.mutate,
    refetch,

    // Pagination controls
    goToPage,
    setPageSize,
    setSearch,
    setSort,
    setFilters,
  };
};