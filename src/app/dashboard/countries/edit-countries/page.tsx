// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import {
//     Globe2,
//     Calendar,
//     GraduationCap,
//     Plane,
//     Building2,
//     BookOpen,
//     DollarSign,
//     FileCheck,
//     Briefcase,
//     Settings,
//     Save,
//     Send,
//     Loader2,
//     ChevronRight,
//     AlertCircle
// } from 'lucide-react';
// import { CountryFormData, CountrySection } from '@/type/country';
// import { CountryOverviewSection } from '@/app/features/countries/components/sections/CountryOverviewSection';
// import dynamic from 'next/dynamic';
// const SharedDynamicFieldsSection = dynamic(
//     () => import('@/components/shared/SharedDynamicFieldsSection').then((mod) => mod.SharedDynamicFieldsSection),
//     { ssr: false }
// );
// import { CountryPlaceholderSection } from '@/app/features/countries/components/sections/CountryPlaceholders';
// import { useCreateCountry } from '@/app/features/countries/hooks/useCountries';
// import { countryService } from '@/app/features/countries/services/countryService';
// import { useMutation } from '@tanstack/react-query';

// const sections = [
//     { id: 'overview', label: 'Study in Country', icon: Globe2, required: true },
//     { id: 'intake', label: 'Intake', icon: Calendar, required: true },
//     { id: 'scholarships', label: 'Scholarships', icon: GraduationCap, required: false },
//     { id: 'visa', label: 'Visa Process', icon: Plane, required: true },
//     { id: 'topUniversities', label: 'Top Universities', icon: Building2, required: false },
//     { id: 'topCourses', label: 'Top Courses', icon: BookOpen, required: false },
//     { id: 'costOfStudy', label: 'Cost of Study', icon: DollarSign, required: true },
//     { id: 'exams', label: 'Exams & Eligibility', icon: FileCheck, required: true },
//     { id: 'work', label: 'Work Opportunities', icon: Briefcase, required: false },
//     { id: 'dynamicFields', label: 'Additional Fields', icon: Settings, required: false },
// ] as const;

// const initialFormData: CountryFormData = {
//     overview: {
//         name: '',
//         slug: '',
//         description: '',
//     },
//     dynamicFields: [],
//     status: 'draft',
//     intakes: []
// };

// export default function AddCountryPage() {
//     const router = useRouter();
//     const [currentSection, setCurrentSection] = useState<CountrySection>('overview');
//     const [formData, setFormData] = useState<CountryFormData>(initialFormData);
//     const [isInitialized, setIsInitialized] = useState(false);

//     const createCountryMutation = useCreateCountry();

//     // const saveDraftMutation = useMutation({
//     //     mutationFn: (data: CountryFormData) =>
//     //         countryService
//     //     onSuccess: () => {
//     //         toast.success('Country saved as draft');
//     //         router.push('/dashboard/countries');
//     //     },
//     //     onError: () => {
//     //         toast.error('Failed to save draft');
//     //     },
//     // });

//     useEffect(() => {
//         setIsInitialized(true);
//     }, []);

//     const handleSectionSave = (section: CountrySection, data: Partial<CountryFormData>) => {
//         setFormData(prev => ({
//             ...prev,
//             ...data,
//         }));
//         toast.success('Progress saved');
//     };

//     const handlePublish = () => {
//         const countryData: CountryFormData = {
//             ...formData,
//             status: 'published',
//         };

//         createCountryMutation.mutate(countryData, {
//             onSuccess: () => {
//                 toast.success('Country published successfully!');
//                 router.push('/dashboard/countries');
//             },
//             onError: () => {
//                 toast.error('Failed to publish country');
//             }
//         });
//     };

//     const handleSaveDraft = () => {
//         const countryData: CountryFormData = {
//             ...formData,
//             status: 'draft',
//         };

//         // saveDraftMutation.mutate(countryData);
//     };

//     const goToSection = (section: CountrySection) => {
//         setCurrentSection(section);
//     };

//     const goToNextSection = () => {
//         const currentIndex = sections.findIndex(s => s.id === currentSection);
//         if (currentIndex < sections.length - 1) {
//             const nextSection = sections[currentIndex + 1].id as CountrySection;
//             goToSection(nextSection);
//         }
//     };

//     const goToPreviousSection = () => {
//         const currentIndex = sections.findIndex(s => s.id === currentSection);
//         if (currentIndex > 0) {
//             const previousSection = sections[currentIndex - 1].id as CountrySection;
//             goToSection(previousSection);
//         }
//     };

//     if (!isInitialized) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-50 min-h-screen pb-12">
//             {/* Header */}
//             <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//                 <div className="mx-auto px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Add New Country</h1>
//                             <p className="text-sm text-gray-600 mt-1">
//                                 Create a destination guide
//                             </p>
//                         </div>
//                         <div className="flex gap-3">
//                             <Button
//                                 variant="outline"
//                                 onClick={handleSaveDraft}
//                                 className="border-gray-200"
//                             >
//                                 {/* {saveDraftMutation.isPending ? (
//                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                 ) : (
//                                     <Save className="h-4 w-4 mr-2" />
//                                 )} */}
//                                 Save Draft
//                             </Button>
//                             <Button
//                                 onClick={handlePublish}
//                                 disabled={createCountryMutation.isPending}
//                                 className="bg-purple-700 hover:bg-purple-800"
//                             >
//                                 {createCountryMutation.isPending ? (
//                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                 ) : (
//                                     <Send className="h-4 w-4 mr-2" />
//                                 )}
//                                 Publish Country
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="mx-auto px-6 py-8">
//                 <div className="flex gap-8">
//                     {/* Sidebar */}
//                     <aside className="w-64 flex-shrink-0">
//                         <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-28 h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
//                             <nav className="space-y-1">
//                                 {sections.map((section) => {
//                                     const Icon = section.icon;
//                                     const isActive = currentSection === section.id;

//                                     return (
//                                         <button
//                                             key={section.id}
//                                             onClick={() => goToSection(section.id as CountrySection)}
//                                             className={`
//                         w-full flex items-center justify-between px-3 py-2.5 rounded-lg
//                         transition-colors duration-200 text-left group
//                         ${isActive
//                                                     ? 'bg-purple-50 text-purple-700 font-medium ring-1 ring-purple-200'
//                                                     : 'text-gray-600 hover:bg-gray-50'
//                                                 }
//                       `}
//                                         >
//                                             <div className="flex items-center gap-3">
//                                                 <Icon className={`h-4 w-4 ${isActive ? 'text-purple-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
//                                                 <span className="text-sm">{section.label}</span>
//                                             </div>
//                                             {isActive && <ChevronRight className="h-4 w-4 text-purple-700" />}
//                                         </button>
//                                     );
//                                 })}
//                             </nav>
//                         </div>
//                     </aside>

//                     {/* Main Content */}
//                     <main className="flex-1 min-w-0">
//                         <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
//                             {currentSection === 'overview' && (
//                                 <CountryOverviewSection
//                                     data={formData.overview}
//                                     onSave={(data) => handleSectionSave('overview', { overview: data })}
//                                     onNext={goToNextSection}
//                                 />
//                             )}

//                             {/* Placeholders for others */}
//                             {['intake', 'scholarships', 'visa', 'topUniversities', 'topCourses', 'costOfStudy', 'exams', 'work'].includes(currentSection) && (
//                                 <CountryPlaceholderSection
//                                     title={sections.find(s => s.id === currentSection)?.label}
//                                     onNext={goToNextSection}
//                                     onPrevious={goToPreviousSection}
//                                 />
//                             )}

//                             {currentSection === 'dynamicFields' && (
//                                 <SharedDynamicFieldsSection
//                                     data={formData.dynamicFields}
//                                     onSave={(data) => handleSectionSave('dynamicFields', { dynamicFields: data })}
//                                     onPrevious={goToPreviousSection}
//                                     entityName="country"
//                                 />
//                             )}
//                         </div>
//                     </main>
//                 </div>
//             </div>
//         </div>
//     );
// }


export default function Page() {
    return (
        // <Suspense fallback={<div>Loading...</div>}>

        <>
            <p>Edit Countries</p>
        </>
        // </Suspense>
    );
}