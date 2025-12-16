import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { universityService } from "../services/universityService";
import { UniversityFormData } from "@/type/university";

export const useUniversities = (params: any = {}) => {
    return useQuery({
        queryKey: ['universities', params],
        queryFn: () => universityService.getAllUniversities(params),
    });
};

// export const useUniversity = (id: string) => {
//     return useQuery({
//         queryKey: ['university', id],
//         queryFn: () => universityService.getUniversityById(id),
//         enabled: !!id,
//     });
// };

// export const useCreateUniversity = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (data: UniversityFormData) => universityService.createUniversity(data),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['universities'] });
//         },
//     });
// };

export const useUpdateUniversity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<UniversityFormData> }) => universityService.updateUniversity(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['universities'] });
            queryClient.invalidateQueries({ queryKey: ['university', variables.id] });
        },
    });
};

export const useDeleteUniversity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => universityService.deleteUniversity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['universities'] });
        },
    });
};
