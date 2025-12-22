// components/AddCountryModal.tsx
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
import { countryService } from "../services/countryService";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface AddCountryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const CONTINENTS = [
    "Africa",
    "Antarctica",
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America",
];

export function AddCountryModal({
    open,
    onOpenChange,
    onSuccess,
}: AddCountryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        capital: "",
        continent: "",
        currency: "",
        language: "",
        population: "",
        about: "",
        status: "draft" as "published" | "draft",
    });

    // File states
    const [flagFile, setFlagFile] = useState<File | null>(null);
    const [flagPreview, setFlagPreview] = useState<string>("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");

    const flagInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "code" ? value.toUpperCase() : value,
        }));
    };

    const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setFlagFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setFlagPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setBannerFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFlag = () => {
        setFlagFile(null);
        setFlagPreview("");
        if (flagInputRef.current) {
            flagInputRef.current.value = "";
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
            toast.error("Country name is required");
            return;
        }
        if (!formData.code.trim() || formData.code.length < 2) {
            toast.error("Valid country code is required (2-3 characters)");
            return;
        }
        if (!formData.capital.trim()) {
            toast.error("Capital is required");
            return;
        }
        if (!formData.continent) {
            toast.error("Continent is required");
            return;
        }

        setIsLoading(true);

        try {
            const submitFormData = new FormData();

            // Generate slug from country name
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            // Append text fields
            submitFormData.append("name", formData.name);
            submitFormData.append("code", formData.code);
            submitFormData.append("capital", formData.capital);
            submitFormData.append("continent", formData.continent);
            submitFormData.append("currency", formData.currency);
            submitFormData.append("language", formData.language);
            submitFormData.append("population", formData.population);
            submitFormData.append("about", formData.about);
            submitFormData.append("status", formData.status);
            submitFormData.append("slug", slug);

            // Append files
            if (flagFile) {
                submitFormData.append("flag", flagFile);
            }
            if (bannerFile) {
                submitFormData.append("banner", bannerFile);
            }

            const response = await countryService.createCountryWithFiles(submitFormData);

            if (response.success) {
                toast.success("Country added successfully");
                onSuccess();
                onOpenChange(false);
                resetForm();
            }
        } catch (error: any) {
            console.error("Error adding country:", error);
            const errorMessage =
                error?.response?.data?.message || "Failed to add country";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            capital: "",
            continent: "",
            currency: "",
            language: "",
            population: "",
            about: "",
            status: "draft",
        });
        setFlagFile(null);
        setFlagPreview("");
        setBannerFile(null);
        setBannerPreview("");
        if (flagInputRef.current) flagInputRef.current.value = "";
        if (bannerInputRef.current) bannerInputRef.current.value = "";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Add New Country
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the basic details to add a new country to the database.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Country Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., United States"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Country Code */}
                        <div className="space-y-2">
                            <Label htmlFor="code">
                                Country Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g., US"
                                className="border-gray-200"
                                maxLength={3}
                                required
                            />
                        </div>

                        {/* Capital */}
                        <div className="space-y-2">
                            <Label htmlFor="capital">
                                Capital <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="capital"
                                name="capital"
                                value={formData.capital}
                                onChange={handleChange}
                                placeholder="e.g., Washington, D.C."
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Continent */}
                        <div className="space-y-2">
                            <Label htmlFor="continent">
                                Continent <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.continent}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, continent: value }))
                                }
                            >
                                <SelectTrigger className="border-gray-200 bg-white">
                                    <SelectValue placeholder="Select continent" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {CONTINENTS.map((continent) => (
                                        <SelectItem key={continent} value={continent}>
                                            {continent}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Currency */}
                        <div className="space-y-2">
                            <Label htmlFor="currency">
                                Currency <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                placeholder="e.g., USD"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            <Label htmlFor="language">
                                Primary Language <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                placeholder="e.g., English"
                                className="border-gray-200"
                                required
                            />
                        </div>

                        {/* Population */}
                        <div className="space-y-2">
                            <Label htmlFor="population">
                                Population <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="population"
                                name="population"
                                value={formData.population}
                                onChange={handleChange}
                                placeholder="e.g., 331 million"
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

                        {/* Flag Upload */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="flag">Country Flag</Label>
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <Input
                                        ref={flagInputRef}
                                        id="flag"
                                        name="flag"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFlagChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => flagInputRef.current?.click()}
                                        className="w-full border-gray-200 hover:bg-gray-50"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {flagFile ? "Change Flag" : "Upload Flag"}
                                    </Button>
                                    {flagFile && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            {flagFile.name} ({(flagFile.size / 1024).toFixed(2)} KB)
                                        </p>
                                    )}
                                </div>
                                {flagPreview && (
                                    <div className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src={flagPreview}
                                            alt="Flag preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeFlag}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                Recommended: 3:2 ratio, max 5MB (JPG, PNG, WebP)
                            </p>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="banner">Country Banner</Label>
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
                                                {bannerFile.name} ({(bannerFile.size / 1024).toFixed(2)}{" "}
                                                KB)
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
                                Recommended: 1920x400px, max 5MB (JPG, PNG, WebP)
                            </p>
                        </div>

                        {/* About */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="about">
                                About Country <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                placeholder="Brief overview about the country..."
                                className="border-gray-200 min-h-[120px]"
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
                                "Add Country"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}