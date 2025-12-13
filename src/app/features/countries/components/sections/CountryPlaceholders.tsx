import { Button } from "@/components/ui/button";

export const CountryPlaceholderSection = ({ title, onNext, onPrevious }: any) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="p-8 border-2 border-dashed rounded-lg text-center text-gray-500">
            Content for {title} goes here.
        </div>
        <div className="flex justify-between gap-4 pt-6 border-t">
            {onPrevious && <Button variant="outline" onClick={onPrevious}>Previous</Button>}
            <Button onClick={onNext} className="bg-purple-700 hover:bg-purple-800">Save & Continue</Button>
        </div>
    </div>
);
