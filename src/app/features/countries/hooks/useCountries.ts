import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { countryService } from "../services/countryService";
import { CountryFormData } from "@/type/country";

export const useCountries = (params: any = {}) => {
    return useQuery({
        queryKey: ['countries', params],
        queryFn: () => countryService.getAllCountries(params),
    });
};

export const useCountry = (id: string) => {
    return useQuery({
        queryKey: ['country', id],
        queryFn: () => countryService.getCountryById(id),
        enabled: !!id,
    });
};

export const useCreateCountry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CountryFormData) => countryService.createCountry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countries'] });
        },
    });
};

export const useUpdateCountry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CountryFormData> }) => countryService.updateCountry(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['countries'] });
            queryClient.invalidateQueries({ queryKey: ['country', variables.id] });
        },
    });
};

export const useDeleteCountry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => countryService.deleteCountry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['countries'] });
        },
    });
};
