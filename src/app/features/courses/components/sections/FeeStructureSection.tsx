"use client";

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Calculator, Loader2, Plus, Trash2, Check, X, Edit } from 'lucide-react';
import { FeeStructure, DynamicField } from '@/type/courseForm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeeStructureSectionProps {
  data: FeeStructure[];
  onSave: (data: FeeStructure[]) => Promise<void>;
  onNext: () => void;
}

export const COUNTRIES = [
  // 🌍 English-speaking majors
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', symbol: '€' },

  // 🇪🇺 Europe (Top Study Destinations)
  { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€' },
  { code: 'FR', name: 'France', currency: 'EUR', symbol: '€' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', symbol: '€' },
  { code: 'IT', name: 'Italy', currency: 'EUR', symbol: '€' },
  { code: 'ES', name: 'Spain', currency: 'EUR', symbol: '€' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
  { code: 'NO', name: 'Norway', currency: 'NOK', symbol: 'kr' },
  { code: 'FI', name: 'Finland', currency: 'EUR', symbol: '€' },
  { code: 'PL', name: 'Poland', currency: 'PLN', symbol: 'zł' },
  { code: 'AT', name: 'Austria', currency: 'EUR', symbol: '€' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },

  // 🌏 South Asia
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', symbol: '₨' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', symbol: '৳' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR', symbol: 'Rs' },
  { code: 'NP', name: 'Nepal', currency: 'NPR', symbol: 'Rs' },

  // 🌏 East & Southeast Asia (Growing Study Markets)
  { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
  { code: 'TH', name: 'Thailand', currency: 'THB', symbol: '฿' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', symbol: '₱' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', symbol: '₫' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },

  // 🌍 Middle East (Popular for Medical / Engineering)
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ' },
  { code: 'QA', name: 'Qatar', currency: 'QAR', symbol: '﷼' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', symbol: '﷼' },
  { code: 'OM', name: 'Oman', currency: 'OMR', symbol: '﷼' },
];

export function FeeStructureSection({
  data = [],
  onSave,
  onNext,
}: FeeStructureSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedFees, setSavedFees] = useState<FeeStructure[]>(data);
  const [isAddingNew, setIsAddingNew] = useState(data.length === 0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [editingCountry, setEditingCountry] = useState<string | null>(null);

  // Get available countries (not yet added, or currently editing)
  const getAvailableCountries = () => {
    return COUNTRIES.filter(
      country => !savedFees.some(fee => fee.country === country.code) || country.code === editingCountry
    );
  };

  const getCurrentCountryData = (country: string): Omit<FeeStructure, 'total'> => {
    const countryInfo = COUNTRIES.find(c => c.code === country);
    return {
      country: country,
      programTuitionFee: 0,
      studentVisaFee: 0,
      accommodation: 0,
      airportTransfer: 0,
      vat: 0,
      currency: countryInfo?.currency || 'GBP',
      dynamicFields: [],
    };
  };

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<Omit<FeeStructure, 'total'>>({
    defaultValues: getCurrentCountryData(selectedCountry),
  });

  // When country changes, reset form
  useEffect(() => {
    if (selectedCountry) {
      const countryInfo = COUNTRIES.find(c => c.code === selectedCountry);

      // If editing, load existing data
      if (editingCountry === selectedCountry) {
        const existingFee = savedFees.find(fee => fee.country === selectedCountry);
        if (existingFee) {
          reset({
            country: existingFee.country,
            programTuitionFee: existingFee.programTuitionFee,
            studentVisaFee: existingFee.studentVisaFee,
            accommodation: existingFee.accommodation,
            airportTransfer: existingFee.airportTransfer,
            vat: existingFee.vat,
            currency: existingFee.currency,
            dynamicFields: existingFee.dynamicFields,
          });
          setDynamicFields(existingFee.dynamicFields || []);
        }
      } else {
        reset(getCurrentCountryData(selectedCountry));
        setDynamicFields([]);
      }

      if (countryInfo) {
        setValue('currency', countryInfo.currency);
      }
    }
  }, [selectedCountry, reset, setValue, editingCountry, savedFees]);

  const programTuitionFee = watch('programTuitionFee') || 0;
  const studentVisaFee = watch('studentVisaFee') || 0;
  const accommodation = watch('accommodation') || 0;
  const airportTransfer = watch('airportTransfer') || 0;
  const vat = watch('vat') || 0;

  // Calculate total including dynamic fields with numeric values
  const calculateTotal = () => {
    const subtotal =
      Number(programTuitionFee) +
      Number(studentVisaFee) +
      Number(accommodation) +
      Number(airportTransfer);

    // Add dynamic fields that have numeric values
    const dynamicFieldsTotal = dynamicFields.reduce((sum, field) => {
      const numValue = parseFloat(field.fieldValue);
      return sum + (isNaN(numValue) ? 0 : numValue);
    }, 0);

    const totalBeforeVAT = subtotal + dynamicFieldsTotal;
    const vatAmount = totalBeforeVAT * (Number(vat) / 100);
    return totalBeforeVAT + vatAmount;
  };

  // Add dynamic field
  const handleAddDynamicField = () => {
    if (!newFieldName.trim()) return;

    const newField: DynamicField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fieldName: newFieldName.trim(),
      fieldValue: '',
      fieldType: 'text',
      order: dynamicFields.length,
    };

    setDynamicFields([...dynamicFields, newField]);
    setNewFieldName('');
  };

  // Update dynamic field value
  const handleUpdateDynamicField = (id: string, value: string) => {
    setDynamicFields(prev =>
      prev.map(field =>
        field.id === id ? { ...field, fieldValue: value } : field
      )
    );
  };

  // Remove dynamic field
  const handleRemoveDynamicField = (id: string) => {
    setDynamicFields(prev => prev.filter(field => field.id !== id));
  };

  const handleSaveCountry = async (formData: Omit<FeeStructure, 'total'>) => {
    if (!selectedCountry) {
      return;
    }

    const feeStructureData: FeeStructure = {
      ...formData,
      dynamicFields: dynamicFields,
      total: calculateTotal(),
    };

    let newSavedFees;
    if (editingCountry) {
      // Update existing
      newSavedFees = savedFees.map(fee =>
        fee.country === editingCountry ? feeStructureData : fee
      );
    } else {
      // Add new
      newSavedFees = [...savedFees, feeStructureData];
    }

    setSavedFees(newSavedFees);

    // Reset form
    setSelectedCountry('');
    setDynamicFields([]);
    setIsAddingNew(false);
    setEditingCountry(null);
  };

  const handleEditCountry = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setEditingCountry(countryCode);
    setIsAddingNew(true);
  };

  const handleRemoveCountry = (countryCode: string) => {
    const filtered = savedFees.filter(fee => fee.country !== countryCode);
    setSavedFees(filtered);
  };

  const handleFinalSave = async () => {
    if (savedFees.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      // Remove 'total' from each fee structure before sending to backend
      const dataForBackend = savedFees.map(({ total, ...rest }) => rest);
      await onSave(dataForBackend as any);
      onNext();
    } catch (error) {
      console.error('Error saving fee structures:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCountryInfo = (code: string) => {
    return COUNTRIES.find(c => c.code === code);
  };

  // Helper to check if a field value is numeric
  const isNumericField = (value: string) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fee Structure</h2>
        <p className="text-sm text-gray-600 mb-6">
          Add fee structures for different countries. You can add custom fields for country-specific fees like application fees or taxes.
        </p>

        {/* Saved Fee Structures */}
        {savedFees.length > 0 && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Added Countries</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {savedFees.length} {savedFees.length === 1 ? 'Country' : 'Countries'}
              </Badge>
            </div>

            <div className="grid gap-4">
              {savedFees.map((fee) => {
                const countryInfo = getCountryInfo(fee.country);
                return (
                  <Card key={fee.country} className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Check className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">
                            {countryInfo?.name}
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Program Fee:</span>
                            <span className="ml-2 font-medium">
                              {countryInfo?.symbol}{fee.programTuitionFee.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Visa Fee:</span>
                            <span className="ml-2 font-medium">
                              {countryInfo?.symbol}{fee.studentVisaFee.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Accommodation:</span>
                            <span className="ml-2 font-medium">
                              {countryInfo?.symbol}{fee.accommodation.toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Airport Transfer:</span>
                            <span className="ml-2 font-medium">
                              {countryInfo?.symbol}{fee.airportTransfer.toFixed(2)}
                            </span>
                          </div>
                          {fee.vat > 0 && (
                            <div>
                              <span className="text-gray-600">VAT:</span>
                              <span className="ml-2 font-medium">
                                {fee.vat}%
                              </span>
                            </div>
                          )}

                          {/* Dynamic Fields Display */}
                          {fee.dynamicFields && fee.dynamicFields.length > 0 && (
                            <>
                              {fee.dynamicFields.map((field) => (
                                <div key={field.id}>
                                  <span className="text-gray-600">{field.fieldName}:</span>
                                  <span className="ml-2 font-medium">
                                    {isNumericField(field.fieldValue)
                                      ? `${countryInfo?.symbol}${parseFloat(field.fieldValue).toFixed(2)}`
                                      : field.fieldValue
                                    }
                                  </span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-lg font-bold text-gray-900">
                            {countryInfo?.symbol}{fee.total?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCountry(fee.country)}
                          disabled={isSubmitting || isAddingNew}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCountry(fee.country)}
                          disabled={isSubmitting || isAddingNew}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Add New Country Button */}
        {!isAddingNew && getAvailableCountries().length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddingNew(true)}
            className="w-full border-dashed border-2 mb-6"
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Country Fee Structure
          </Button>
        )}

        {/* Add/Edit Form */}
        {isAddingNew && (
          <form onSubmit={handleSubmit(handleSaveCountry)} className="space-y-6">
            <Card className="p-6 bg-white border-gray-200">
              <h3 className="font-semibold text-lg mb-4">
                {editingCountry ? 'Edit Fee Structure' : 'Add Fee Structure'}
              </h3>

              {/* Country Dropdown */}
              <div className="mb-6">
                <Label>Select Country *</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => setSelectedCountry(value)}
                  disabled={!!editingCountry}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCountries().map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedCountry && !editingCountry && (
                  <p className="text-sm text-gray-500 mt-1">
                    Select a country to add fee structure
                  </p>
                )}
              </div>

              {selectedCountry && (
                <div className="space-y-4">
                  {/* Currency (Read-only) */}
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      {...register('currency')}
                      readOnly
                      className="bg-gray-100 mt-2"
                    />
                  </div>

                  {/* Program Tuition Fee */}
                  <div>
                    <Label htmlFor="programTuitionFee">Program Tuition Fee *</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {getCountryInfo(selectedCountry)?.symbol}
                      </span>
                      <Input
                        id="programTuitionFee"
                        type="number"
                        step="0.01"
                        {...register('programTuitionFee', {
                          required: 'Program tuition fee is required',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Fee must be positive' }
                        })}
                        className="pl-8"
                        placeholder="0.00"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    {errors.programTuitionFee && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.programTuitionFee.message}
                      </p>
                    )}
                  </div>

                  {/* Student Visa Fee */}
                  <div>
                    <Label htmlFor="studentVisaFee">Student Visa Fee</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {getCountryInfo(selectedCountry)?.symbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        {...register('studentVisaFee', { valueAsNumber: true })}
                        className="pl-8"
                        placeholder="0.00"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div>
                    <Label htmlFor="accommodation">Accommodation</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {getCountryInfo(selectedCountry)?.symbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        {...register('accommodation', { valueAsNumber: true })}
                        className="pl-8"
                        placeholder="0.00"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>

                  {/* Airport Transfer */}
                  <div>
                    <Label htmlFor="airportTransfer">Airport Transfer</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {getCountryInfo(selectedCountry)?.symbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        {...register('airportTransfer', { valueAsNumber: true })}
                        className="pl-8"
                        placeholder="0.00"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>

                  {/* VAT Percentage */}
                  <div>
                    <Label htmlFor="vat">VAT (%)</Label>
                    <div className="relative mt-2">
                      <Input
                        type="number"
                        step="0.01"
                        {...register('vat', {
                          valueAsNumber: true,
                          min: { value: 0, message: 'VAT must be positive' },
                          max: { value: 100, message: 'VAT cannot exceed 100%' }
                        })}
                        placeholder="0"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                    {errors.vat && (
                      <p className="text-sm text-red-600 mt-1">{errors.vat.message}</p>
                    )}
                  </div>

                  {/* Dynamic Fields Section */}
                  <div className="pt-4 border-t">
                    <div className="mb-4">
                      <Label className="text-base font-semibold">Additional Fees (Optional)</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Add country-specific fees. Enter numeric values to include them in total calculation.
                      </p>
                    </div>

                    {/* Add Dynamic Field Input */}
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="e.g., Application Fee, Processing Fee, Service Tax"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDynamicField();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddDynamicField}
                        disabled={!newFieldName.trim()}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>

                    {/* Dynamic Fields List */}
                    {dynamicFields.length > 0 && (
                      <div className="space-y-3">
                        {dynamicFields.map((field) => (
                          <div key={field.id} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <Label className="text-sm mb-1">
                                {field.fieldName}
                                {isNumericField(field.fieldValue) && (
                                  <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
                                    Included in total
                                  </Badge>
                                )}
                              </Label>
                              <div className="relative">
                                <Input
                                  placeholder={`Enter ${field.fieldName.toLowerCase()} (numeric values will be added to total)`}
                                  value={field.fieldValue}
                                  onChange={(e) =>
                                    handleUpdateDynamicField(field.id, e.target.value)
                                  }
                                />
                                {/* {isNumericField(field.fieldValue) && (
                                  // <span className="absolute  left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  //   {getCountryInfo(selectedCountry)?.symbol}
                                  // </span>
                                )} */}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDynamicField(field.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-gray-600" />
                        <Label className="text-lg font-semibold">Total Amount</Label>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {getCountryInfo(selectedCountry)?.symbol}
                        {calculateTotal().toFixed(2)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * Numeric dynamic field values are included in the total calculation
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setSelectedCountry('');
                    setDynamicFields([]);
                    setEditingCountry(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedCountry || isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {editingCountry ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Update {getCountryInfo(selectedCountry)?.name} Fees
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add {getCountryInfo(selectedCountry)?.name} Fees
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        )}

        {/* No countries available message */}
        {!isAddingNew && getAvailableCountries().length === 0 && savedFees.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              All available countries have been added. You can edit or remove a country to make changes.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button
          type="button"
          onClick={handleFinalSave}
          disabled={savedFees.length === 0 || isSubmitting}
          className="bg-gray-900 hover:bg-gray-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save & Continue'
          )}
        </Button>
      </div>
    </div>
  );
}