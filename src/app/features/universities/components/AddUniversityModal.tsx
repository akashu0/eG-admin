// components/AddUniversityModal.tsx
"use client";

import React, { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { universityService } from "../services/universityService";
import { toast } from "sonner";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface AddUniversityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddUniversityModal({
    open,
    onOpenChange,
    onSuccess,
}: AddUniversityModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        city: "",
        location: "",
        websiteLink: "",
        founded: "",
        totalStudents: "",
        internationalStudents: "",
        rank: "",
        about: "",
        status: "draft" as "published" | "draft",
    });

    // File states
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");

    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "founded" || name === "totalStudents" || name === "internationalStudents" || name === "rank"
                ? parseInt(value) || 0
                : value,
        }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setBannerFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview("");
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    };

    const removeBanner = () => {
        setBannerFile(null);
        setBannerPreview("");
        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error("University name is required");
            return;
        }
        if (!formData.country.trim()) {
            toast.error("Country is required");
            return;
        }
        if (!formData.city.trim()) {
            toast.error("City is required");
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitFormData = new FormData();

            // Generate slug from university name
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Append text fields
            submitFormData.append("name", formData.name);
            submitFormData.append("country", formData.country);
            submitFormData.append("city", formData.city);
            submitFormData.append("location", `${formData.city}, ${formData.country}`);
            submitFormData.append("founded", formData.founded.toString());
            submitFormData.append("totalStudents", formData.totalStudents.toString());
            submitFormData.append("internationalStudents", formData.internationalStudents.toString());
            submitFormData.append("rank", formData.rank.toString());
            submitFormData.append("about", formData.about);
            submitFormData.append("status", formData.status);
            submitFormData.append("slug", slug);

            if (formData.websiteLink) {
                submitFormData.append("websiteLink", formData.websiteLink);
            }

            // Append files
            if (logoFile) {
                submitFormData.append("logo", logoFile);
            }
            if (bannerFile) {
                submitFormData.append("banner", bannerFile);
            }

            const response = await universityService.createUniversityWithFiles(submitFormData);

            if (response.success) {
                toast.success("University added successfully");
                onSuccess();
                onOpenChange(false);
                resetForm();
            }
        } catch (error: any) {
            console.error("Error adding university:", error);
            const errorMessage = error?.response?.data?.message || "Failed to add university";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            country: "",
            city: "",
            location: "",
            websiteLink: "",
            founded: "",
            totalStudents: "",
            internationalStudents: "",
            rank: "",
            about: "",
            status: "draft",
        });
        setLogoFile(null);
        setLogoPreview("");
        setBannerFile(null);
        setBannerPreview("");
        if (logoInputRef.current) logoInputRef.current.value = "";
        if (bannerInputRef.current) bannerInputRef.current.value = "";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] lg:max-w-[85vw] xl:max-w-[75vw] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Add New University
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new university to the database.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* University Name */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name">
                                University Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Harvard University"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <Label htmlFor="country">
                                Country <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="e.g., United States"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <Label htmlFor="city">
                                City <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g., Cambridge"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Website Link */}
                        <div className="space-y-2">
                            <Label htmlFor="websiteLink">Website Link</Label>
                            <Input
                                id="websiteLink"
                                name="websiteLink"
                                type="text"
                                value={formData.websiteLink}
                                onChange={handleChange}
                                placeholder="https://www.university.edu"
                                className="border-gray-200"
                            />
                        </div>

                        {/* Founded Year */}
                        <div className="space-y-2">
                            <Label htmlFor="founded">
                                Founded Year <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="founded"
                                name="founded"
                                type="text"
                                value={formData.founded}
                                onChange={handleChange}
                                placeholder="1636"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Total Students */}
                        <div className="space-y-2">
                            <Label htmlFor="totalStudents">
                                Total Students <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="totalStudents"
                                name="totalStudents"
                                type="text"
                                value={formData.totalStudents}
                                onChange={handleChange}
                                placeholder="20000"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* International Students */}
                        <div className="space-y-2">
                            <Label htmlFor="internationalStudents">
                                International Students <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="internationalStudents"
                                name="internationalStudents"
                                type="text"
                                value={formData.internationalStudents}
                                onChange={handleChange}
                                placeholder="5000"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* World Rank */}
                        <div className="space-y-2">
                            <Label htmlFor="rank">
                                World Rank <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="rank"
                                name="rank"
                                type="text"
                                value={formData.rank}
                                onChange={handleChange}
                                placeholder="1"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: "published" | "draft") =>
                                    setFormData((prev) => ({ ...prev, status: value }))
                                }
                            >
                                <SelectTrigger className="border-gray-200 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="logo">University Logo</Label>
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <Input
                                        ref={logoInputRef}
                                        id="logo"
                                        name="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => logoInputRef.current?.click()}
                                        className="w-full border-gray-200 hover:bg-gray-50"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {logoFile ? "Change Logo" : "Upload Logo"}
                                    </Button>
                                    {logoFile && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            {logoFile.name} ({(logoFile.size / 1024).toFixed(2)} KB)
                                        </p>
                                    )}
                                </div>
                                {logoPreview && (
                                    <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src={logoPreview}
                                            alt="Logo preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeLogo}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                Recommended: Square image, max 5MB (JPG, PNG, WebP)
                            </p>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="banner">University Banner</Label>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <Input
                                            ref={bannerInputRef}
                                            id="banner"
                                            name="banner"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerChange}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => bannerInputRef.current?.click()}
                                            className="w-full border-gray-200 hover:bg-gray-50"
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {bannerFile ? "Change Banner" : "Upload Banner"}
                                        </Button>
                                        {bannerFile && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {bannerFile.name} ({(bannerFile.size / 1024).toFixed(2)} KB)
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {bannerPreview && (
                                    <div className="relative w-full h-40 border border-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src={bannerPreview}
                                            alt="Banner preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeBanner}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                Recommended: 1920x400px or similar aspect ratio, max 5MB (JPG, PNG, WebP)
                            </p>
                        </div>

                        {/* About */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="about">
                                About University <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                placeholder="Brief description about the university..."
                                className="border-gray-200 min-h-[100px]"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="border-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gray-900 hover:bg-gray-800"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add University"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}