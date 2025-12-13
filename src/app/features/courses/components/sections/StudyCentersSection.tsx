"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, Building2, User, Phone, MapPinned } from 'lucide-react';

import { Checkbox } from "@/components/ui/checkbox";
import { EarningCenter } from '@/type/studyCenter';
import { centerService } from '@/app/features/egcenter/service/centerservice';

// Accept both old and new data structures for backward compatibility
interface StudyCentersSectionProps {
  data:
  | Array<{ centerIds: string }> // New structure - array of objects from backend
  | { centerIds?: string[] } // Alternative structure
  | Array<any> // Old structure (StudyCenter[])
  | null;
  onSave: (data: Array<{ centerIds: string }>) => void;
  onNext: () => void;
}

export function StudyCentersSection({
  data,
  onSave,
  onNext,
}: StudyCentersSectionProps) {
  const [centers, setCenters] = useState<EarningCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCenterIds, setSelectedCenterIds] = useState<string[]>([]);

  // Handle both old and new data structures
  const getCenterIds = (): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) {
      // Check if it's the backend format: [{ centerIds: "id" }]
      if (data.length > 0 && data[0].centerIds) {
        return data.map((item: any) => item.centerIds);
      }
      return []; // Old structure or empty array
    }
    // Alternative format: { centerIds: ["id1", "id2"] }
    return (data as any).centerIds || [];
  };

  const { handleSubmit } = useForm();

  // Fetch all centers on component mount
  useEffect(() => {
    fetchCenters();
  }, []);

  // Set initial selected centers
  useEffect(() => {
    const initialIds = getCenterIds();
    if (initialIds.length > 0) {
      setSelectedCenterIds(initialIds);
    }
  }, [data]);

  const fetchCenters = async () => {
    try {
      setIsLoading(true);
      const response = await centerService.getAllCenters();

      console.log('Centers API Response:', response);

      // Handle both array response and nested response
      const centerData = Array.isArray(response)
        ? response
        : (response as any)?.data || [];

      console.log('Extracted Centers:', centerData);
      setCenters(centerData);
    } catch (error) {
      console.error('Error fetching centers:', error);
      setCenters([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Group centers by location
  const centersByLocation = centers.reduce((acc, center) => {
    const location = center.location || 'Other';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(center);
    return acc;
  }, {} as Record<string, EarningCenter[]>);

  const handleCenterToggle = (centerId: string) => {
    setSelectedCenterIds(prev => {
      if (prev.includes(centerId)) {
        return prev.filter(id => id !== centerId);
      } else {
        return [...prev, centerId];
      }
    });
  };

  const onSubmit = () => {
    // Backend expects an array of objects: [{ centerIds: "id1" }, { centerIds: "id2" }]
    // Transform the selectedCenterIds array to match backend schema
    const formattedData = selectedCenterIds.map(id => ({ centerIds: id }));

    onSave(formattedData as any);
    onNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-600">Loading study centers...</span>
      </div>
    );
  }

  const selectedCenters = centers.filter(center => selectedCenterIds.includes(center.id));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-8 w-8 text-gray-900" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Centers</h2>
            <p className="text-sm text-gray-600">Select the study centers for this course (optional)</p>
          </div>
        </div>

        <Card className="p-6 bg-white border-gray-200">
          <div className="space-y-6">
            {centers.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No study centers available</p>
                <p className="text-sm text-gray-500 mt-2">
                  Add centers in the EG Earning Centers section first
                </p>
              </div>
            ) : (
              <>
                {/* Selection Area */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Select Study Centers for this Course
                  </Label>

                  <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                    {Object.entries(centersByLocation).map(([location, locationCenters]) => (
                      <div key={location} className="space-y-2">
                        {/* Location Header */}
                        <div className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded">
                          📍 {location}
                        </div>

                        {/* Centers in this location */}
                        {locationCenters.map((center) => (
                          <div
                            key={center.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${selectedCenterIds.includes(center.id)
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200'
                              }`}
                          >
                            <Checkbox
                              id={center.id}
                              checked={selectedCenterIds.includes(center.id)}
                              onCheckedChange={() => handleCenterToggle(center.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <label
                                    htmlFor={center.id}
                                    className="font-medium text-gray-900 cursor-pointer block"
                                  >
                                    {center.name}
                                  </label>
                                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <MapPinned className="h-3.5 w-3.5" />
                                      <span>{center.location}</span>
                                    </div>
                                    {center.address && (
                                      <div className="flex items-center gap-2">
                                        <Building2 className="h-3.5 w-3.5" />
                                        <span>{center.address}</span>
                                      </div>
                                    )}
                                    {center.contactPerson && (
                                      <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5" />
                                        <span>{center.contactPerson}</span>
                                      </div>
                                    )}
                                    {center.contactNumber && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5" />
                                        <span>{center.contactNumber}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${center.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                  {center.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    {selectedCenterIds.length > 0
                      ? `${selectedCenterIds.length} center${selectedCenterIds.length > 1 ? 's' : ''} selected`
                      : 'No centers selected (optional)'}
                  </p>
                </div>

                {/* Selected Centers Preview */}
                {selectedCenters.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Selected Study Centers Preview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCenters.map((center) => (
                        <Card key={center.id} className="p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{center.name}</h4>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${center.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {center.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPinned className="h-3.5 w-3.5" />
                              <span>{center.location}</span>
                            </div>
                            {center.contactPerson && (
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                <span>{center.contactPerson}</span>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
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