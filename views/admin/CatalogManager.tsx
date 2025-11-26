
import React, { useState } from 'react';
import { Game, Category, Platform, CustomFieldConfig, GameVariant } from '../../types';
import { GenericModule } from '../../components/AdminUI';
import { Card, Button, Input, Modal, Select, TextArea, Checkbox, DevNote } from '../../components/UIComponents';
import { Plus, Settings, Save, Trash2, Copy, Layers, Gift } from 'lucide-react';

interface CatalogManagerProps {
    subTab: string;
    games: Game[];
    categories: Category[];
    platforms: Platform[];
    onSaveGame: (g: Game) => void;
    onDeleteGame: (id: string) => void;
    onSaveCategory: (c: Category) => void;
    onDeleteCategory: (id: string) => void;
    onSavePlatform: (p: Platform) => void;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({ 
    subTab, games, categories, platforms, onSaveGame, onDeleteGame, onSaveCategory, onDeleteCategory, onSavePlatform 
}) => {
    
    // --- GAMES STATE ---
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const [gameForm, setGameForm] = useState<Partial<Game>>({});
    
    // --- CONFIG EDITOR STATE ---
    const [configEditorOpen, setConfigEditorOpen] = useState(false);
    const [selectedCatForConfig, setSelectedCatForConfig] = useState<string>('');
    
    // Config Temp States
    const [tempFields, setTempFields] = useState<CustomFieldConfig[]>([]);
    const [tempDelivery, setTempDelivery] = useState<('Instant' | 'Manual')[]>([]);
    const [tempVariants, setTempVariants] = useState<GameVariant[]>([]);

    // --- BULK TOOLS STATE ---
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [bulkFee, setBulkFee] = useState(0);

    const openGameModal = (g?: Game) => {
        setGameForm(g ? { ...g } : { id: '', name: '', slug: '', image: '', categoryIds: [], categoryConfigs: {} });
        setIsGameModalOpen(true);
    };

    const handleCloneGame = (g: Game) => {
        const clonedGame = {
            ...g,
            id: '', 
            name: `${g.name} (Copy)`,
            slug: `${g.slug}-copy`
        };
        openGameModal(clonedGame);
    };

    const handleOpenConfigEditor = (catId: string) => {
        setSelectedCatForConfig(catId);
        const existingConfig = gameForm.categoryConfigs?.[catId];
        setTempFields(existingConfig?.listingFields || []);
        setTempDelivery(existingConfig?.deliveryOptions || ['Instant', 'Manual']);
        setTempVariants(existingConfig?.predefinedVariants || []);
        setConfigEditorOpen(true);
    };

    const handleSaveConfig = () => {
        const newConfigs = { ...gameForm.categoryConfigs };
        newConfigs[selectedCatForConfig] = {
            listingFields: tempFields,
            buyerFields: [], // Simplified for this demo
            deliveryOptions: tempDelivery,
            predefinedVariants: tempVariants.length > 0 ? tempVariants : undefined
        };
        setGameForm({ ...gameForm, categoryConfigs: newConfigs });
        setConfigEditorOpen(false);
    };

    // Field Actions
    const addField = () => {
        setTempFields([...tempFields, { id: `field_${Date.now()}`, label: 'New Field', type: 'text', required: false, filterType: 'select' }]);
    };
    const updateField = (index: number, key: keyof CustomFieldConfig, value: any) => {
        const updated = [...tempFields];
        updated[index] = { ...updated[index], [key]: value };
        setTempFields(updated);
    };

    // Variant Actions
    const addVariant = () => {
        setTempVariants([...tempVariants, { id: `v_${Date.now()}`, name: 'New Product' }]);
    };
    const updateVariant = (index: number, key: keyof GameVariant, value: string) => {
        const updated = [...tempVariants];
        updated[index] = { ...updated[index], [key]: value };
        setTempVariants(updated);
    };

    if (subTab === 'GAMES') {
        return (
            <Card title="Games Catalog" action={<Button icon={Plus} onClick={() => openGameModal()}>Add Game</Button>}>
                <DevNote title="Soft Delete Requirement">
                    <strong>Critical:</strong> When "Deleting" a game, never perform a `DELETE` SQL operation. 
                    Use `UPDATE games SET deleted_at = NOW()` instead. 
                    This prevents historical orders from breaking (users still need to see what they bought 2 years ago).
                </DevNote>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map(game => (
                        <div key={game.id} className="bg-nexus-main border border-nexus-border rounded-lg p-3 flex gap-3 items-center group hover:border-nexus-primary transition-colors">
                            <img src={game.image} className="w-12 h-12 rounded object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-white truncate">{game.name}</div>
                                <div className="text-xs text-gray-500">{game.slug}</div>
                            </div>
                            <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="px-2" onClick={() => handleCloneGame(game)} title="Clone Game"><Copy size={14}/></Button>
                                <Button size="sm" variant="secondary" onClick={() => openGameModal(game)}>Edit</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* GAME EDIT MODAL */}
                <Modal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} title="Game Editor" size="lg">
                    <div className="space-y-6">
                        <DevNote title="DB Constraint: Slugs">
                            `slug` must be unique per game. Implement a unique index in the database. <br/>
                            If `categoryIds` change, ensure you don't orphan existing listings. Warn admin if disabling a category with active listings.
                        </DevNote>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Name" value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} />
                            <Input label="Slug" value={gameForm.slug} onChange={e => setGameForm({...gameForm, slug: e.target.value})} />
                        </div>
                        <Input label="Image URL" value={gameForm.image} onChange={e => setGameForm({...gameForm, image: e.target.value})} />
                        <DevNote title="Image Optimization">
                            Images should be uploaded to S3/R2 and processed into WebP format. Store only the CDN path in the DB.
                        </DevNote>
                        <Input label="Banner/Detail Image URL" value={gameForm.detailImage} onChange={e => setGameForm({...gameForm, detailImage: e.target.value})} />
                        
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Enabled Categories</label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {categories.map(cat => {
                                    const isSelected = gameForm.categoryIds?.includes(cat.id);
                                    return (
                                        <div 
                                            key={cat.id} 
                                            onClick={() => {
                                                const ids = gameForm.categoryIds || [];
                                                const newIds = isSelected ? ids.filter(i => i !== cat.id) : [...ids, cat.id];
                                                setGameForm({...gameForm, categoryIds: newIds});
                                            }}
                                            className={`px-3 py-1.5 rounded cursor-pointer border text-xs font-bold transition-all ${isSelected ? 'bg-nexus-primary border-nexus-primary text-white' : 'bg-nexus-main border-nexus-border text-gray-500 hover:text-white'}`}
                                        >
                                            {cat.name}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CONFIG BUTTONS PER CATEGORY */}
                            {gameForm.categoryIds && gameForm.categoryIds.length > 0 && (
                                <div className="bg-[#150d22] p-4 rounded-lg border border-nexus-border">
                                    <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Configure Filters & Products</label>
                                    <DevNote title="Backend Logic: JSONB Config Schema">
                                        The settings below (Delivery Options, Variants, Fields) are stored in the `categoryConfigs` JSONB column in the `games` table. <br/>
                                        Schema: `Record&lt;CategoryId, GameCategoryConfig&gt;`
                                    </DevNote>
                                    <div className="space-y-2">
                                        {gameForm.categoryIds.map(catId => {
                                            const cat = categories.find(c => c.id === catId);
                                            return (
                                                <div key={catId} className="flex justify-between items-center bg-nexus-card p-2 rounded border border-nexus-border">
                                                    <span className="text-sm text-white font-bold">{cat?.name}</span>
                                                    <Button size="sm" variant="outline" icon={Settings} onClick={() => handleOpenConfigEditor(catId)}>Config</Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-nexus-border">
                            {gameForm.id && <Button variant="danger" onClick={() => { onDeleteGame(gameForm.id!); setIsGameModalOpen(false); }}>Delete Game</Button>}
                            <div className="flex gap-2 ml-auto">
                                <Button variant="ghost" onClick={() => setIsGameModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => { onSaveGame({...gameForm, id: gameForm.id || Date.now().toString()} as Game); setIsGameModalOpen(false); }}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* FIELD CONFIG MODAL (Nested) */}
                <Modal isOpen={configEditorOpen} onClose={() => setConfigEditorOpen(false)} title={`Config: ${categories.find(c => c.id === selectedCatForConfig)?.name}`} size="lg">
                    <div className="space-y-6">
                         <DevNote title="Frontend-Backend Sync">
                             Updates here must cascade to the frontend immediately. <br/>
                             If a field ID is changed/deleted, handle migration of existing listing data (either keep orphan data in JSONB or clean it up).
                         </DevNote>

                         {/* 1. DELIVERY OPTIONS */}
                         <div className="bg-[#150d22] p-3 rounded border border-nexus-border">
                             <label className="text-xs font-bold text-gray-400 mb-2 block uppercase">Allowed Delivery Methods</label>
                             <div className="flex gap-4">
                                <Checkbox 
                                    label="Instant Delivery" 
                                    checked={tempDelivery.includes('Instant')} 
                                    onChange={() => {
                                        setTempDelivery(prev => prev.includes('Instant') ? prev.filter(d => d !== 'Instant') : [...prev, 'Instant'])
                                    }}
                                />
                                <Checkbox 
                                    label="Manual Delivery" 
                                    checked={tempDelivery.includes('Manual')} 
                                    onChange={() => {
                                        setTempDelivery(prev => prev.includes('Manual') ? prev.filter(d => d !== 'Manual') : [...prev, 'Manual'])
                                    }}
                                />
                             </div>
                         </div>
                         
                         {/* 2. PRE-DEFINED PRODUCTS (VARIANTS) - Specifically for Gift Cards/Fixed Items */}
                         <div className="bg-nexus-card p-4 rounded border border-nexus-border">
                             <div className="flex justify-between items-center mb-3">
                                 <div>
                                     <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                         <Gift size={14} className="text-nexus-primary"/> Pre-defined Products
                                     </div>
                                     <p className="text-[10px] text-gray-500">If defined, sellers MUST choose one of these products instead of typing a title.</p>
                                 </div>
                                 <Button size="sm" icon={Plus} onClick={addVariant}>Add Product</Button>
                             </div>

                             <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                                 {tempVariants.length === 0 && <div className="text-xs text-gray-500 italic">No pre-defined products. Sellers can type custom titles.</div>}
                                 {tempVariants.map((variant, idx) => (
                                     <div key={idx} className="flex flex-col gap-2 p-3 bg-nexus-main rounded border border-nexus-border">
                                         <div className="flex gap-2 items-center">
                                            <Input 
                                                placeholder="Product Name (e.g. 1000)" 
                                                value={variant.name} 
                                                onChange={e => updateVariant(idx, 'name', e.target.value)}
                                                className="py-1 text-xs"
                                            />
                                            <Input 
                                                placeholder="Image URL (Optional)" 
                                                value={variant.image || ''} 
                                                onChange={e => updateVariant(idx, 'image', e.target.value)}
                                                className="py-1 text-xs"
                                            />
                                            <button onClick={() => { const n = [...tempVariants]; n.splice(idx, 1); setTempVariants(n); }} className="text-red-500 p-1 hover:bg-white/10 rounded"><Trash2 size={14}/></button>
                                         </div>
                                         <div>
                                            <Input 
                                                placeholder="Subtitle / Unit (e.g. V-Bucks)" 
                                                value={variant.subtitle || ''} 
                                                onChange={e => updateVariant(idx, 'subtitle', e.target.value)}
                                                className="py-1 text-xs"
                                            />
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         {/* 3. CUSTOM FIELDS */}
                         <div>
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-xs font-bold text-gray-400 uppercase">Seller Input Fields</div>
                                <Button size="sm" icon={Plus} onClick={addField}>Add Field</Button>
                            </div>
                            
                            <div className="max-h-[200px] overflow-y-auto space-y-3 custom-scrollbar pr-1">
                                {tempFields.map((field, idx) => (
                                    <div key={idx} className="bg-[#150d22] p-3 rounded border border-nexus-border flex flex-col gap-3">
                                        <div className="flex gap-2">
                                            <Input placeholder="Field Label (e.g. Skin)" value={field.label} onChange={e => updateField(idx, 'label', e.target.value)} className="text-xs py-1" />
                                            <Input placeholder="ID (e.g. skin_rare)" value={field.id} onChange={e => updateField(idx, 'id', e.target.value)} className="text-xs py-1" />
                                            <button onClick={() => { const n = [...tempFields]; n.splice(idx, 1); setTempFields(n); }} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Select value={field.type} onChange={e => updateField(idx, 'type', e.target.value)} className="text-xs py-1">
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="select">Select Dropdown</option>
                                            </Select>
                                            <Select value={field.filterType} onChange={e => updateField(idx, 'filterType', e.target.value)} className="text-xs py-1">
                                                <option value="none">No Filter</option>
                                                <option value="select">Filter by Select</option>
                                                <option value="range">Filter by Range</option>
                                            </Select>
                                        </div>
                                        {field.type === 'select' && (
                                            <Input 
                                                placeholder="Options (comma separated): Red,Blue,Green" 
                                                value={Array.isArray(field.options) ? field.options.join(',') : field.options} 
                                                onChange={e => updateField(idx, 'options', e.target.value.split(','))} 
                                                className="text-xs py-1"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                         </div>
                         
                         <div className="flex justify-end pt-4">
                             <Button icon={Save} onClick={handleSaveConfig}>Save Configuration</Button>
                         </div>
                    </div>
                </Modal>
            </Card>
        );
    }

    if (subTab === 'CATEGORIES') {
        return (
            <>
                <div className="flex justify-end mb-4">
                    <Button variant="secondary" icon={Layers} onClick={() => setIsBulkModalOpen(true)}>Bulk Update Fees</Button>
                </div>
                <GenericModule<Category>
                    title="Categories"
                    data={categories}
                    columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'slug', label: 'Slug' },
                        { key: 'layout', label: 'Layout' },
                        { key: 'isActive', label: 'Active', render: (c) => c.isActive ? 'Yes' : 'No' }
                    ]}
                    fields={[
                        { key: 'name', label: 'Name', type: 'text' },
                        { key: 'slug', label: 'Slug', type: 'text' },
                        { key: 'layout', label: 'Layout Style', type: 'select', options: ['LIST_GRID', 'GROUPED_GIFT_CARD'] },
                        { key: 'isActive', label: 'Is Active', type: 'boolean' }
                    ]}
                    defaultValues={{ isActive: true, layout: 'LIST_GRID' } as Partial<Category>}
                    onSave={onSaveCategory}
                    onDelete={onDeleteCategory}
                />

                <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Bulk Update Fees">
                    <div className="space-y-4">
                        <DevNote title="Bulk Transaction">
                            This action should run as a database transaction. It updates the `fee_percentage` column for ALL category rows in one go.
                        </DevNote>
                        <p className="text-sm text-gray-400">Apply a standard fee percentage to ALL categories. This will override existing settings.</p>
                        <Input label="New Fee Percentage (%)" type="number" value={bulkFee} onChange={e => setBulkFee(Number(e.target.value))} />
                        <div className="flex justify-end gap-2">
                             <Button onClick={() => { alert(`Applied ${bulkFee}% fee to all categories.`); setIsBulkModalOpen(false); }}>Apply to All</Button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }

    if (subTab === 'PLATFORMS') {
         return (
            <GenericModule<Platform>
                title="Platforms"
                data={platforms}
                columns={[{ key: 'name', label: 'Name' }, { key: 'id', label: 'ID' }]}
                fields={[{ key: 'name', label: 'Name', type: 'text' }, { key: 'icon', label: 'Icon Key', type: 'text' }]}
                onSave={onSavePlatform}
                onDelete={() => {}}
            />
         );
    }

    return <div>Select a sub-module</div>;
};
