"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plane, Loader2, FileText, DollarSign, Clock, TrendingUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { visaService } from '@/app/features/visa/services/visaService';
import { Visa } from '@/type/visa';

interface VisaProcessSectionProps {
  data: Array<{ visaId: any }> | any[] | null;
  onSave: (data: { visaId: string }) => void;
  onNext: () => void;
}
export function VisaProcessSection({
  data,
  onSave,
  onNext,
}: VisaProcessSectionProps) {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);

  // Extract visaId from the data structure
  const getVisaId = () => {
    if (!data || !Array.isArray(data) || data.length === 0) return '';

    // Handle nested visaId object structure from API
    const firstVisa = data[0];
    if (firstVisa?.visaId) {
      // If visaId is an object with _id
      if (typeof firstVisa.visaId === 'object' && firstVisa.visaId._id) {
        return firstVisa.visaId._id;
      }
      // If visaId is a string
      if (typeof firstVisa.visaId === 'string') {
        return firstVisa.visaId;
      }
    }
    return '';
  };

  const { handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      visaId: getVisaId(),
    },
  });

  const visaId = watch('visaId');

  // Fetch all visas on component mount
  useEffect(() => {
    fetchVisas();
  }, []);

  // Update selected visa when visaId changes
  useEffect(() => {
    if (visaId && visas.length > 0) {
      const visa = visas.find(v => v.id === visaId);
      setSelectedVisa(visa || null);
    } else {
      setSelectedVisa(null);
    }
  }, [visaId, visas]);

  const fetchVisas = async () => {
    try {
      setIsLoading(true);
      const response = await visaService.getAllVisas({ status: 'active' });

      // Extract the data array from the response
      const visaData = Array.isArray(response) ? response : (response as any)?.data || [];
      setVisas(visaData);

      // Set default value if data exists
      const visaId = getVisaId();
      if (visaId) {
        setValue('visaId', visaId);
      }
    } catch (error) {
      console.error('Error fetching visas:', error);
      setVisas([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Group visas by country
  const visasByCountry = Array.isArray(visas)
    ? visas.reduce((acc, visa) => {
      if (!acc[visa.country]) {
        acc[visa.country] = [];
      }
      acc[visa.country].push(visa);
      return acc;
    }, {} as Record<string, Visa[]>)
    : {};

  const onSubmit = (formData: { visaId: string }) => {
    if (!formData.visaId) {
      alert('Please select a visa process');
      return;
    }

    onSave({ visaId: formData.visaId });
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600">Loading visa processes...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Plane className="h-8 w-8 text-gray-900" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visa Process</h2>
            <p className="text-sm text-gray-600">Select the visa process for this course</p>
          </div>
        </div>

        <Card className="p-6 bg-white border-gray-200">
          <div className="space-y-6">
            {/* Currently Selected Visa Info */}
            {data && data.length > 0 && data[0]?.visaId && typeof data[0].visaId === 'object' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Currently Selected</p>
                    <p className="text-lg font-semibold text-blue-700">
                      {data[0].visaId.country} Visa Process
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Visa Selection by Country */}
            <div>
              <Label htmlFor="visaId" className="text-base font-semibold mb-3 block">
                Select Visa Process by Country <span className="text-red-500">*</span>
              </Label>

              <Select
                value={visaId}
                onValueChange={(value) => setValue('visaId', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a country and visa process" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(visasByCountry).length === 0 ? (
                    <SelectItem value="no-visa" disabled>
                      No visa processes available
                    </SelectItem>
                  ) : (
                    Object.entries(visasByCountry).map(([country, countryVisas]) => (
                      <div key={country}>
                        <div className="px-2 py-2 text-sm font-semibold text-gray-900 bg-gray-50 sticky top-0">
                          {country}
                        </div>
                        {countryVisas.map((visa) => (
                          <SelectItem
                            key={visa.id}
                            value={visa.id}
                            className="pl-6"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${visa.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {visa.status}
                              </span>
                              <span>{visa.country} Visa</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))
                  )}
                </SelectContent>
              </Select>

              {!visaId && (
                <p className="text-sm text-gray-500 mt-2">
                  Select a visa process that matches your course destination country
                </p>
              )}
            </div>

            {/* Selected Visa Preview */}
            {selectedVisa && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Visa Process Preview
                </h3>

                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-gray-700 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Visa Fee</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedVisa.currency || '$'} {selectedVisa.visaFee}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-700 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Processing Time</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedVisa.visaProcessingTime} {selectedVisa.visaProcessingTimeUnit}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-gray-700 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Success Rate</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedVisa.visaSuccessRate}%
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-gray-700 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Renewal Cost</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedVisa.currency || '$'} {selectedVisa.visaRenewalCost}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Visa Steps Preview */}
                  {selectedVisa.visaSteps && selectedVisa.visaSteps.length > 0 && (
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-start gap-3 mb-3">
                        <FileText className="h-5 w-5 text-gray-700 mt-0.5" />
                        <p className="text-sm font-medium text-gray-700">
                          Visa Process Steps ({selectedVisa.visaSteps.length})
                        </p>
                      </div>
                      <div className="space-y-2 ml-8">
                        {selectedVisa.visaSteps.slice(0, 3).map((step) => (
                          <div key={step.id} className="flex items-start gap-2 text-sm">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex-shrink-0">
                              {step.stepNumber}
                            </div>
                            <div>
                              <span className="text-gray-900 font-medium">{step.title}</span>
                              {step.estimatedDays && (
                                <span className="text-gray-500 text-xs ml-2">
                                  (~{step.estimatedDays} days)
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {selectedVisa.visaSteps.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{selectedVisa.visaSteps.length - 3} more steps
                          </p>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Required Documents Preview */}
                  {selectedVisa.visaDocuments && selectedVisa.visaDocuments.length > 0 && (
                    <Card className="p-4 bg-gray-50">
                      <div className="flex items-start gap-3 mb-3">
                        <FileText className="h-5 w-5 text-gray-700 mt-0.5" />
                        <p className="text-sm font-medium text-gray-700">
                          Required Documents ({selectedVisa.visaDocuments.length})
                        </p>
                      </div>
                      <div className="space-y-1.5 ml-8">
                        {selectedVisa.visaDocuments.slice(0, 5).map((doc) => (
                          <div key={doc.id} className="flex items-center gap-2 text-sm">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${doc.isMandatory
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                              }`}>
                              {doc.isMandatory ? 'Required' : 'Optional'}
                            </span>
                            <span className="text-gray-700">{doc.name}</span>
                          </div>
                        ))}
                        {selectedVisa.visaDocuments.length > 5 && (
                          <p className="text-sm text-gray-500">
                            +{selectedVisa.visaDocuments.length - 5} more documents
                          </p>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}