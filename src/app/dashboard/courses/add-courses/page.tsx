"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';


// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  GraduationCap,
  DollarSign,
  FileText,
  Plane,
  Briefcase,
  MapPin,
  File,
  Settings,
  Send,
  Loader2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

// Types & Services
import { CourseFormData, CourseSection } from '@/type/courseForm';
import { courseService } from '@/app/features/courses/services/courseService';

// Section Components
import { CourseOverviewSection } from '@/app/features/courses/components/sections/CourseOverviewSection';
import { ProgramDeliverySection } from '@/app/features/courses/components/sections/ProgramDeliverySection';
import { FeeStructureSection } from '@/app/features/courses/components/sections/FeeStructureSection';
import { DocumentsRequiredSection } from '@/app/features/courses/components/sections/DocumentsRequiredSection';
import { VisaProcessSection } from '@/app/features/courses/components/sections/VisaProcessSection';
import { CareerOpportunitiesSection } from '@/app/features/courses/components/sections/CareerOpportunitiesSection';
import { StudyCentersSection } from '@/app/features/courses/components/sections/StudyCentersSection';
import { BrochureSection } from '@/app/features/courses/components/sections/BrochureSection';
import dynamic from 'next/dynamic';
import { useCourseCreationStore } from '@/store/courseDraftStore';

const DynamicFieldsSection = dynamic(
  () => import('@/app/features/courses/components/sections/DynamicFieldsSection').then((mod) => mod.DynamicFieldsSection),
  { ssr: false }
);

const sections = [
  { id: 'overview', label: 'Overview', icon: BookOpen, required: true },
  { id: 'programDelivery', label: 'Program Delivery', icon: GraduationCap, required: true },
  { id: 'feeStructure', label: 'Fee Structure', icon: DollarSign, required: true },
  { id: 'documents', label: 'Documents', icon: FileText, required: true },
  { id: 'visa', label: 'Visa', icon: Plane, required: true },
  { id: 'career', label: 'Career', icon: Briefcase, required: true },
  { id: 'studyCenters', label: 'Study Centers', icon: MapPin, required: false },
  { id: 'brochure', label: 'Brochure', icon: File, required: false },
  { id: 'dynamicFields', label: 'Additional Fields', icon: Settings, required: false },
] as const;

export default function AddCoursePage() {
  const router = useRouter();

  const {
    courseSlug,
    currentSection,
    completedSections,
    setCourseSlug,
    setCurrentSection,
    markSectionComplete,
    resetCourseCreation,
  } = useCourseCreationStore();

  // Reset on mount
  useEffect(() => {
    resetCourseCreation();
  }, [resetCourseCreation]);

  console.log(courseSlug, "courseSlug");


  // Create course overview mutation
  const createOverviewMutation = useMutation({
    mutationFn: (overview: CourseFormData['overview']) =>
      courseService.createCourseOverview(overview),
    onSuccess: (data) => {
      const slug = data.course.overview.slug;
      console.log(slug, "slug");
      setCourseSlug(slug);
      markSectionComplete('overview');
      toast.success('Course overview created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create course overview');
    },
  });

  // Update section mutations
  const updateSectionMutation = useMutation({
    mutationFn: async ({
      section,
      data
    }: {
      section: CourseSection;
      data: any
    }) => {
      if (!courseSlug) throw new Error('Course not created yet');

      const updateMap = {
        programDelivery: () => courseService.updateProgramDelivery(courseSlug, data),
        feeStructure: () => courseService.updateFeeStructures(courseSlug, data),
        documents: () => courseService.updateDocumentsRequired(courseSlug, data),
        visa: () => courseService.updateVisaProcess(courseSlug, data),
        career: () => courseService.updateCareerOpportunities(courseSlug, data),
        studyCenters: () => courseService.updateStudyCenters(courseSlug, data),
        brochure: () => courseService.updateBrochure(courseSlug, data),
        dynamicFields: () => courseService.updateDynamicFields(courseSlug, data),
      };

      const updateFn = updateMap[section as keyof typeof updateMap];
      if (updateFn) {
        return await updateFn();
      }
    },
    onSuccess: (_, { section }) => {
      markSectionComplete(section);
      toast.success('Section saved successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save section');
    },
  });

  // Publish course mutation
  const publishCourseMutation = useMutation({
    mutationFn: () => {
      if (!courseSlug) throw new Error('Course not created yet');
      return courseService.publishCourse(courseSlug);
    },
    onSuccess: () => {
      toast.success('Course published successfully!');
      resetCourseCreation();
      router.push('/dashboard/courses');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to publish course');
    },
  });

  // Handle section save
  const handleSectionSave = async (
    section: CourseSection,
    data: any
  ) => {
    try {
      // If overview section, create course in backend
      if (section === 'overview') {
        await createOverviewMutation.mutateAsync(data);
      }
      // For other sections, update if course exists
      else if (courseSlug) {
        await updateSectionMutation.mutateAsync({ section, data });
      } else {
        toast.error('Please create course overview first');
        throw new Error('Course slug not found');
      }
    } catch (error) {
      // Error is already handled by the mutation's onError
      throw error;
    }
  };

  const handlePublish = () => {
    if (!allRequiredSectionsCompleted) {
      toast.error('Please complete all required sections');
      return;
    }
    publishCourseMutation.mutate();
  };

  const goToSection = (section: CourseSection) => {
    setCurrentSection(section);
  };

  const goToNextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1].id as CourseSection;
      goToSection(nextSection);
    }
  };

  const goToPreviousSection = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex > 0) {
      const previousSection = sections[currentIndex - 1].id as CourseSection;
      goToSection(previousSection);
    }
  };

  // Check if section is completed
  const isSectionCompleted = (sectionId: CourseSection): boolean => {
    return completedSections.has(sectionId);
  };

  const allRequiredSectionsCompleted = sections
    .filter(s => s.required)
    .every(s => isSectionCompleted(s.id as CourseSection));

  const isLoading = createOverviewMutation.isPending ||
    updateSectionMutation.isPending ||
    publishCourseMutation.isPending;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Course</h1>
              <p className="text-sm text-gray-600 mt-1">
                {courseSlug ? (
                  <>Course Slug: <span className="font-mono text-purple-600">{courseSlug}</span></>
                ) : (
                  'Create and publish a new course to your catalog'
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePublish}
                className="bg-black hover:bg-black"
              >
                {publishCourseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={!allRequiredSectionsCompleted || isLoading}
                className="bg-purple-700 hover:bg-purple-800"
              >
                {publishCourseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Publish Course
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-28 h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = currentSection === section.id;
                  const isCompleted = isSectionCompleted(section.id as CourseSection);

                  return (
                    <button
                      key={section.id}
                      onClick={() => goToSection(section.id as CourseSection)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                        transition-colors duration-200 text-left group
                        ${isActive
                          ? 'bg-purple-50 text-purple-700 font-medium ring-1 ring-purple-200'
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-purple-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{section.label}</span>
                          {section.required && (
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-1.5 py-0 ${isActive ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
                            >
                              Req
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-purple-700' : 'bg-green-500'}`} />
                        )}
                        {isActive && <ChevronRight className="h-4 w-4 text-purple-700" />}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              {!allRequiredSectionsCompleted && courseSlug && (
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Please complete all required sections before publishing the course.
                  </AlertDescription>
                </Alert>
              )}

              {currentSection === 'overview' && (
                <CourseOverviewSection
                  data={{
                    courseName: '',
                    slug: '',
                    headingDescription: '',
                    description: '',
                    durationYears: 0,
                    durationMonths: 0,
                    studyMode: 'online',
                    studyModeType: 'regular',
                    awardedBy: '',
                    nextIntake: '',
                    level: '',
                    courseImage: '',
                  }}
                  onSave={(data) => handleSectionSave('overview', data)}
                  onNext={goToNextSection}
                />
              )}
              {currentSection === 'programDelivery' && (
                <ProgramDeliverySection
                  data={[]}
                  onSave={(data) => handleSectionSave('programDelivery', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}

              {currentSection === 'feeStructure' && (
                <FeeStructureSection
                  data={[]}
                  onSave={(data) => handleSectionSave('feeStructure', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}

              {currentSection === 'documents' && (
                <DocumentsRequiredSection
                  data={[]}
                  onSave={(data) => handleSectionSave('documents', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}

              {currentSection === 'visa' && (
                <VisaProcessSection
                  data={[]}
                  onSave={(data) => handleSectionSave('visa', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}

              {currentSection === 'career' && (
                <CareerOpportunitiesSection
                  data={[]}
                  onSave={(data) => handleSectionSave('career', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}

              {currentSection === 'studyCenters' && (
                <StudyCentersSection
                  data={[]}
                  onSave={(data) => handleSectionSave('studyCenters', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}

              {currentSection === 'brochure' && (
                <BrochureSection
                  data={{ title: '', description: '', fileUrl: '', fileName: '', fileSize: 0 }}
                  onSave={(data) => handleSectionSave('brochure', data)}
                  onNext={goToNextSection}
                  onPrevious={goToPreviousSection}
                />
              )}
              {/* 
              {currentSection === 'dynamicFields' && (
                <DynamicFieldsSection
                  data={[]}
                  onSave={(data) => handleSectionSave('dynamicFields', data)}
                  onPrevious={goToPreviousSection}
                />
              )} */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}