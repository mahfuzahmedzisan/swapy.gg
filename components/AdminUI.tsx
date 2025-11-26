import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, X } from 'lucide-react';
import { Button, Input, Modal, Select, Badge, Card, TextArea, Checkbox } from './UIComponents';

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface GenericDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchKey?: keyof T;
}

export const GenericDataTable = <T extends { id: string }>({ data, columns, onEdit, onDelete, searchKey }: GenericDataTableProps<T>) => {
  const [query, setQuery] = useState('');

  const filteredData = searchKey 
    ? data.filter(item => String(item[searchKey]).toLowerCase().includes(query.toLowerCase()))
    : data;

  return (
    <div className="space-y-4">
        {searchKey && (
            <div className="max-w-xs">
                <Input 
                    placeholder="Search..." 
                    icon={Search} 
                    value={query} 
                    onChange={e => setQuery(e.target.value)} 
                />
            </div>
        )}
        <div className="overflow-x-auto bg-nexus-card border border-nexus-border rounded-lg">
        <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-nexus-main text-xs uppercase font-bold text-gray-500">
            <tr>
                {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">{col.label}</th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border">
            {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-nexus-hover transition-colors">
                {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4">
                    {col.key === 'actions' ? (
                        <div className="flex gap-2">
                        {onEdit && <Button size="sm" variant="secondary" onClick={() => onEdit(item)}><Edit size={14}/></Button>}
                        {onDelete && <Button size="sm" variant="danger" onClick={() => onDelete(item)}><Trash2 size={14}/></Button>}
                        </div>
                    ) : (
                        col.render ? col.render(item) : String(item[col.key])
                    )}
                    </td>
                ))}
                </tr>
            )) : (
                <tr><td colSpan={columns.length} className="px-6 py-8 text-center text-gray-600">No data found</td></tr>
            )}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export interface GenericField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'boolean';
    options?: string[];
}

interface GenericModuleProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    fields: GenericField[];
    onSave: (item: T) => void;
    onDelete: (id: string) => void;
    defaultValues?: Partial<T>;
}

// A powerful generic component that creates a full List/Create/Edit/Delete view
export const GenericModule = <T extends { id: string }>({ title, data, columns, fields, onSave, onDelete, defaultValues }: GenericModuleProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<T>>({});

    const handleEdit = (item: T) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: T) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDelete(item.id);
        }
    };

    const handleCreate = () => {
        setCurrentItem(defaultValues || {});
        setIsModalOpen(true);
    };

    const handleSave = () => {
        // Mock ID generation if new
        const itemToSave = { ...currentItem, id: currentItem.id || Math.random().toString(36).substr(2, 9) } as T;
        onSave(itemToSave);
        setIsModalOpen(false);
    };

    const allColumns = [
        ...columns,
        { key: 'actions' as keyof T, label: 'Actions' }
    ];

    return (
        <Card title={title} action={<Button icon={Plus} onClick={handleCreate}>Add New</Button>}>
            <GenericDataTable 
                data={data} 
                columns={allColumns} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${currentItem.id ? 'Edit' : 'New'} Item`}>
                <div className="space-y-4">
                    {fields.map(field => (
                        <div key={field.key}>
                            {field.type === 'select' ? (
                                <Select 
                                    label={field.label}
                                    value={String(currentItem[field.key as keyof T] || '')}
                                    onChange={e => setCurrentItem({...currentItem, [field.key]: e.target.value})}
                                >
                                    <option value="">Select...</option>
                                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </Select>
                            ) : field.type === 'textarea' ? (
                                <TextArea
                                    label={field.label}
                                    value={String(currentItem[field.key as keyof T] || '')}
                                    onChange={e => setCurrentItem({...currentItem, [field.key]: e.target.value})}
                                    rows={4}
                                />
                            ) : field.type === 'boolean' ? (
                                <div className="pt-4">
                                    <Checkbox 
                                        label={field.label}
                                        checked={Boolean(currentItem[field.key as keyof T])}
                                        onChange={() => setCurrentItem({...currentItem, [field.key]: !currentItem[field.key as keyof T]})}
                                    />
                                </div>
                            ) : (
                                <Input 
                                    label={field.label}
                                    type={field.type}
                                    value={String(currentItem[field.key as keyof T] || '')}
                                    onChange={e => setCurrentItem({...currentItem, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value})}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};