// AddEditCenterModal.tsx (Updated imports and types)
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { centerService } from "@/app/features/egcenter/service/centerservice";
import { EarningCenter } from "@/type/studyCenter";

interface AddEditCenterModalProps {
    isOpen: boolean;
    onClose: () => void;
    center: EarningCenter | null;
    onSuccess: (center: EarningCenter) => void;
}

export function AddEditCenterModal({
    isOpen,
    onClose,
    center,
    onSuccess,
}: AddEditCenterModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        contactPerson: "",
        contactNumber: "",
        address: "",
        status: "active" as "active" | "inactive",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (center) {
            setFormData({
                name: center.name,
                location: center.location,
                contactPerson: center.contactPerson,
                contactNumber: center.contactNumber,
                address: center.address,
                status: center.status,
            });
        } else {
            setFormData({
                name: "",
                location: "",
                contactPerson: "",
                contactNumber: "",
                address: "",
                status: "active",
            });
        }
        setErrors({});
    }, [center, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Center name is required";
        }
        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if (center) {
                // Update existing center
                const updatedCenter = await centerService.updateCenter(center.id, formData);
                onSuccess(updatedCenter);
            } else {
                // Create new center
                const newCenter = await centerService.createCenter(formData);
                onSuccess(newCenter);
            }
            onClose();
        } catch (error) {
            console.error("Error saving center:", error);
            // Handle error (you can add toast notification here)
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>
                        {center ? "Edit Center" : "Add New Center"}
                    </DialogTitle>
                    <DialogDescription>
                        {center
                            ? "Update the center details below."
                            : "Fill in the details to create a new earning center."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Center Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter center name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Location <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className={errors.location ? "border-red-500" : ""}
                        />
                        {errors.location && (
                            <p className="text-sm text-red-500">{errors.location}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactPerson">
                            Contact Person
                        </Label>
                        <Input
                            id="contactPerson"
                            placeholder="Enter contact person name"
                            value={formData.contactPerson}
                            onChange={(e) => handleChange("contactPerson", e.target.value)}
                            className={errors.contactPerson ? "border-red-500" : ""}
                        />
                        {errors.contactPerson && (
                            <p className="text-sm text-red-500">{errors.contactPerson}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">
                            Contact Number
                        </Label>
                        <Input
                            id="contactNumber"
                            placeholder="Enter contact number"
                            value={formData.contactNumber}
                            onChange={(e) => handleChange("contactNumber", e.target.value)}
                            className={errors.contactNumber ? "border-red-500" : ""}
                        />
                        {errors.contactNumber && (
                            <p className="text-sm text-red-500">{errors.contactNumber}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">
                            Address
                        </Label>
                        <Input
                            id="address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                handleChange("status", value as "active" | "inactive")
                            }
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 cursor-pointer focus:ring-purple-600"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {center ? "Update" : "Create"} Center
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}