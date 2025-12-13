"use client";

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2, Plus, Type, Image as ImageIcon, List, AlignLeft, Hash } from 'lucide-react'; // Renaming Image to ImageIcon to avoid conflict
import { DynamicField, FieldType } from '@/type/common';

interface DynamicFieldBuilderProps {
    fields: DynamicField[];
    onChange: (fields: DynamicField[]) => void;
}

const SortableFieldItem = ({
    field,
    onRemove,
    onUpdate
}: {
    field: DynamicField;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<DynamicField>) => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderFieldInput = () => {
        switch (field.fieldType) {
            case 'text':
                return (
                    <Input
                        value={field.fieldValue as string}
                        onChange={(e) => onUpdate(field.id, { fieldValue: e.target.value })}
                        placeholder="Value"
                    />
                );
            case 'richtext':
                return (
                    <Textarea
                        value={field.fieldValue as string}
                        onChange={(e) => onUpdate(field.id, { fieldValue: e.target.value })}
                        placeholder="Enter rich text content..."
                        rows={4}
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        value={field.fieldValue as number}
                        onChange={(e) => onUpdate(field.id, { fieldValue: parseFloat(e.target.value) })}
                        placeholder="0"
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={field.fieldValue as boolean}
                            onCheckedChange={(checked) => onUpdate(field.id, { fieldValue: checked })}
                        />
                        <span className="text-sm text-gray-500">{field.fieldValue ? 'True' : 'False'}</span>
                    </div>
                );
            case 'dropdown':
                return (
                    <div className="space-y-2">
                        <Input
                            value={(field.options || []).join(',')}
                            onChange={(e) => onUpdate(field.id, { options: e.target.value.split(',') })}
                            placeholder="Options (comma separated)"
                            className="mb-2"
                        />
                        <Select
                            value={field.fieldValue as string}
                            onValueChange={(value) => onUpdate(field.id, { fieldValue: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {(field.options || []).map((opt, idx) => (
                                    <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            case 'media':
                return (
                    <div className="border border-dashed p-4 rounded text-center">
                        <p className="text-sm text-gray-400">Media Upload Placeholder</p>
                        {/* Implement actual file upload if needed */}
                    </div>
                );
            default:
                return null;
        }
    };

    const getIcon = () => {
        switch (field.fieldType) {
            case 'text': return <Type className="h-4 w-4" />;
            case 'richtext': return <AlignLeft className="h-4 w-4" />;
            case 'number': return <Hash className="h-4 w-4" />;
            case 'dropdown': return <List className="h-4 w-4" />;
            case 'media': return <ImageIcon className="h-4 w-4" />;
            default: return <Type className="h-4 w-4" />;
        }
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3">
            <div className="flex items-start gap-3">
                <div {...attributes} {...listeners} className="mt-2 cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-50 rounded-md text-purple-600">
                                {getIcon()}
                            </div>
                            <Input
                                value={field.fieldName}
                                onChange={(e) => onUpdate(field.id, { fieldName: e.target.value })}
                                className="h-8 w-48 font-medium border-transparent hover:border-gray-200 focus:border-purple-500 transition-colors"
                                placeholder="Field Name"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(field.id)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="pl-11">
                        {renderFieldInput()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export function DynamicFieldBuilder({ fields, onChange }: DynamicFieldBuilderProps) {
    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);
            onChange(arrayMove(fields, oldIndex, newIndex));
        }
    };

    const addField = (type: FieldType) => {
        const newField: DynamicField = {
            id: `field_${Date.now()}`,
            fieldName: 'New Field',
            fieldValue: type === 'boolean' ? false : '',
            fieldType: type,
            order: fields.length,
            options: type === 'dropdown' ? ['Option 1', 'Option 2'] : undefined
        };
        onChange([...fields, newField]);
    };

    const removeField = (id: string) => {
        onChange(fields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<DynamicField>) => {
        onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <Button variant="outline" size="sm" onClick={() => addField('text')} className="flex flex-col h-auto py-3 gap-2">
                    <Type className="h-4 w-4" />
                    <span className="text-xs">Text</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('richtext')} className="flex flex-col h-auto py-3 gap-2">
                    <AlignLeft className="h-4 w-4" />
                    <span className="text-xs">Rich Text</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('number')} className="flex flex-col h-auto py-3 gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="text-xs">Number</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('boolean')} className="flex flex-col h-auto py-3 gap-2">
                    <Switch checked={true} className="scale-75 pointer-events-none" />
                    <span className="text-xs">Boolean</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('dropdown')} className="flex flex-col h-auto py-3 gap-2">
                    <List className="h-4 w-4" />
                    <span className="text-xs">Dropdown</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => addField('media')} className="flex flex-col h-auto py-3 gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-xs">Media</span>
                </Button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={fields.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {fields.map((field) => (
                            <SortableFieldItem
                                key={field.id}
                                field={field}
                                onRemove={removeField}
                                onUpdate={updateField}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Add fields from the menu above</p>
                </div>
            )}
        </div>
    );
}
