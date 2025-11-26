
import React, { useState } from 'react';
import { Game, Category, Platform, PlatformGroup, InventoryItem } from '../../types';
import { GenericModule } from '../../components/AdminUI';
import { Card, Button, Input, Select, Checkbox, Modal } from '../../components/UIComponents';
import { Plus, X } from 'lucide-react';

interface CatalogModuleProps {
    subTab: string;
    games: Game[];
    categories: Category[];
    platforms: Platform[];
    onSaveGame: (g: Game) => void;
    onDeleteGame: (id: string) => void;
    onSaveCategory: (c: Category) => void;
    onDeleteCategory: (id: string) => void;
    onSavePlatform: (p: Platform) => void; // Assume passed from parent
}

export const CatalogModule: React.FC<CatalogModuleProps> = ({ 
    subTab, games, categories, platforms, onSaveGame, onDeleteGame, onSaveCategory, onDeleteCategory, onSavePlatform 
}) => {
    
    // --- INVENTORY MOCK ---
    const [inventory, setInventory] = useState<InventoryItem[]>([
        { id: '1', name: 'Official Gift Card $10', stock: 500, cost: 8.50, supplier: 'Official' }
    ]);

    // --- GAMES STATE (Moved to Top Level to fix Hook Error) ---
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const [gameForm, setGameForm] = useState<Partial<Game>>({});

    const openGameModal = (g?: Game) => {
        setGameForm(g ? { ...g } : { id: '', name: '', slug: '', image: '', categoryIds: [], categoryConfigs: {} });
        setIsGameModalOpen(true);
    };

    if (subTab === 'GAMES') {
        return (
            <Card title="Games Catalog" action={<Button icon={Plus} onClick={() => openGameModal()}>Add Game</Button>}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {games.map(game => (
                        <div key={game.id} className="bg-nexus-main border border-nexus-border rounded-lg p-3 flex gap-3 items-center">
                            <img src={game.image} className="w-12 h-12 rounded object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-white truncate">{game.name}</div>
                                <div className="text-xs text-gray-500">{game.slug}</div>
                            </div>
                            <Button size="sm" variant="secondary" onClick={() => openGameModal(game)}>Edit</Button>
                        </div>
                    ))}
                </div>

                <Modal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} title="Game Editor">
                    <div className="space-y-4">
                        <Input label="Name" value={gameForm.name} onChange={e => setGameForm({...gameForm, name: e.target.value})} />
                        <Input label="Slug" value={gameForm.slug} onChange={e => setGameForm({...gameForm, slug: e.target.value})} />
                        <Input label="Image URL" value={gameForm.image} onChange={e => setGameForm({...gameForm, image: e.target.value})} />
                        
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-2 block">Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <div 
                                        key={cat.id} 
                                        onClick={() => {
                                            const ids = gameForm.categoryIds || [];
                                            const newIds = ids.includes(cat.id) ? ids.filter(i => i !== cat.id) : [...ids, cat.id];
                                            setGameForm({...gameForm, categoryIds: newIds});
                                        }}
                                        className={`px-3 py-1 rounded cursor-pointer border ${gameForm.categoryIds?.includes(cat.id) ? 'bg-nexus-primary border-nexus-primary text-white' : 'bg-nexus-main border-nexus-border text-gray-500'}`}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            {gameForm.id && <Button variant="danger" onClick={() => { onDeleteGame(gameForm.id!); setIsGameModalOpen(false); }}>Delete</Button>}
                            <Button onClick={() => { onSaveGame({...gameForm, id: gameForm.id || Date.now().toString()} as Game); setIsGameModalOpen(false); }}>Save Game</Button>
                        </div>
                    </div>
                </Modal>
            </Card>
        );
    }

    if (subTab === 'CATEGORIES') {
        return (
            <GenericModule<Category>
                title="Categories"
                data={categories}
                columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'slug', label: 'Slug' },
                    { key: 'isActive', label: 'Active', render: (c) => c.isActive ? 'Yes' : 'No' }
                ]}
                fields={[
                    { key: 'name', label: 'Name', type: 'text' },
                    { key: 'slug', label: 'Slug', type: 'text' },
                ]}
                onSave={onSaveCategory}
                onDelete={onDeleteCategory}
            />
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

    if (subTab === 'INVENTORY') {
        return (
            <GenericModule<InventoryItem>
                title="Official Inventory"
                data={inventory}
                columns={[
                    { key: 'name', label: 'Item Name' },
                    { key: 'stock', label: 'Stock' },
                    { key: 'cost', label: 'Cost Basis ($)' },
                    { key: 'supplier', label: 'Supplier' }
                ]}
                fields={[
                    { key: 'name', label: 'Name', type: 'text' },
                    { key: 'stock', label: 'Stock', type: 'number' },
                    { key: 'cost', label: 'Cost', type: 'number' },
                    { key: 'supplier', label: 'Supplier', type: 'text' }
                ]}
                onSave={(item) => {
                    if(inventory.find(i => i.id === item.id)) {
                        setInventory(inventory.map(i => i.id === item.id ? item : i));
                    } else {
                        setInventory([...inventory, item]);
                    }
                }}
                onDelete={(id) => setInventory(inventory.filter(i => i.id !== id))}
            />
        );
    }

    return <div>Select a sub-module</div>;
};
