
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { CMSPage, MediaItem, ThemeConfig, KnowledgeBaseArticle, Banner } from '../../types';
import { Badge, Button, Card, Input, Select, TextArea, Checkbox, DevNote } from '../../components/UIComponents';
import { Globe, Mail, Save, Upload, Image as ImageIcon, Trash2, Copy, RefreshCw, Layout, Type, Moon, Sun } from 'lucide-react';

interface ContentManagerProps {
    subTab: string;
    banners: Banner[];
    onSaveBanner: (b: Banner) => void;
    onDeleteBanner: (id: string) => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ subTab, banners, onSaveBanner, onDeleteBanner }) => {
    
    // --- STATE ---
    const [pages, setPages] = useState<CMSPage[]>([{ id: 'p1', title: 'Terms of Service', slug: 'terms', lastEdited: '2025-10-01' }]);
    const [kb, setKb] = useState<KnowledgeBaseArticle[]>([{ id: 'kb1', title: 'How to buy?', category: 'Buying', views: 1200, status: 'Published' }]);
    
    // Media State
    const [media, setMedia] = useState<MediaItem[]>([
        { id: 'm1', name: 'logo_v2.png', url: 'https://via.placeholder.com/150', size: '24KB' },
        { id: 'm2', name: 'banner_main.jpg', url: 'https://via.placeholder.com/300x150', size: '1.2MB' }
    ]);

    // Theme State
    const [themes, setThemes] = useState<ThemeConfig[]>([
        { 
            id: 'th1', 
            name: 'Dark Nebula (Default)', 
            active: true, 
            mode: 'dark', 
            colors: { main: '#0f0518', card: '#1b142d', primary: '#8b5cf6', border: '#2f264a' } 
        },
        { 
            id: 'th2', 
            name: 'Light Daybreak', 
            mode: 'light', 
            active: false, 
            colors: { main: '#f8fafc', card: '#ffffff', primary: '#6366f1', border: '#e2e8f0' } 
        }
    ]);

    const [activeThemeConfig, setActiveThemeConfig] = useState<ThemeConfig['colors']>({
        main: '#0f0518',
        card: '#1b142d',
        primary: '#8b5cf6',
        border: '#2f264a'
    });

    const [selectedThemeMode, setSelectedThemeMode] = useState<'dark' | 'light'>('dark');

    // SEO State
    const [seoConfig, setSeoConfig] = useState({ 
        title: 'SWAPY.GG | Gaming Marketplace', 
        description: 'Buy and sell digital assets.', 
        keywords: 'gaming, marketplace, skins',
        robotsTxt: 'User-agent: *\nDisallow: /admin\nAllow: /'
    });

    // Email State
    const [emailTemplate, setEmailTemplate] = useState({ id: 'welcome', subject: 'Welcome to SWAPY!', body: '<h1>Welcome, {username}!</h1><p>Thanks for joining.</p>' });
    const [languages, setLanguages] = useState([
        { code: 'en', name: 'English', active: true },
        { code: 'es', name: 'Spanish', active: true },
        { code: 'fr', name: 'French', active: false },
        { code: 'de', name: 'German', active: false },
    ]);

    // --- HANDLERS ---
    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find((i: any) => i.id === item.id)) setter(list.map((i: any) => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter((i: any) => i.id !== id));

    const toggleLanguage = (code: string) => {
        setLanguages(prev => prev.map(l => l.code === code ? { ...l, active: !l.active } : l));
    };

    const handleUpload = () => {
        const newItem: MediaItem = {
            id: `m_${Date.now()}`,
            name: `upload_${Date.now()}.png`,
            url: 'https://via.placeholder.com/150',
            size: `${(Math.random() * 2).toFixed(2)}MB`
        };
        setMedia([newItem, ...media]);
    };

    const generateSitemap = () => {
        alert("Sitemap.xml generated and cached successfully!");
    }

    const applyThemePreview = () => {
        // This simulates a live update by changing CSS variables on the root document
        const root = document.documentElement;
        root.style.setProperty('--color-main', activeThemeConfig.main);
        root.style.setProperty('--color-card', activeThemeConfig.card);
        root.style.setProperty('--color-primary', activeThemeConfig.primary);
        root.style.setProperty('--color-border', activeThemeConfig.border);
        
        // Also toggle class if needed
        if(selectedThemeMode === 'light') {
            document.body.classList.add('theme-light');
        } else {
            document.body.classList.remove('theme-light');
        }

        alert("Theme Preview Applied! Refresh to reset if needed.");
    };

    // --- RENDERERS ---

    if (subTab === 'CMS') return (
        <>
            <DevNote title="Static Site Generation (SSG)">
                Pages like Terms of Service or Help Center should be statically generated for performance. <br/>
                When updating content here, trigger a webhook to your build server (e.g. Vercel Deploy Hook) to regenerate the static HTML.
            </DevNote>
            <GenericModule<CMSPage> title="Pages" data={pages} columns={[{key:'title', label:'Title'}, {key:'slug', label:'Slug'}]} fields={[{key:'title', label:'Title', type:'text'}, {key:'slug', label:'Slug', type:'text'}]} onSave={handleSave(setPages, pages)} onDelete={handleDelete(setPages, pages)} />
        </>
    );
    
    if (subTab === 'KB') return <GenericModule<KnowledgeBaseArticle> title="Knowledge Base" data={kb} columns={[{key:'title', label:'Question'}, {key:'category', label:'Category'}, {key:'status', label:'Status'}]} fields={[{key:'title', label:'Question', type:'text'}, {key:'category', label:'Category', type:'select', options:['Buying','Selling','Account']}, {key:'status', label:'Status', type:'select', options:['Published','Draft']}]} onSave={handleSave(setKb, kb)} onDelete={handleDelete(setKb, kb)} />;
    
    if (subTab === 'BANNERS') return <GenericModule<Banner> title="Marketing Banners" data={banners} columns={[{key:'title', label:'Title'}, {key:'position', label:'Pos'}, {key:'active', label:'Active', render: b=><Badge>{b.active?'Yes':'No'}</Badge>}]} fields={[{key:'title', label:'Title', type:'text'}, {key:'imageUrl', label:'Image URL', type:'text'}, {key:'link', label:'Link', type:'text'}, {key:'position', label:'Position', type:'number'}, {key:'active', label:'Active', type:'boolean'}]} onSave={onSaveBanner} onDelete={onDeleteBanner} />;

    if (subTab === 'MEDIA') return (
        <Card title="Media Library" action={<Button icon={Upload} onClick={handleUpload}>Upload New File</Button>}>
            <DevNote title="CDN Strategy">
                Uploads should go to an S3 bucket configured with a CDN (Cloudflare). <br/>
                <strong>Requirement:</strong> Automatically convert large PNG/JPG uploads to WebP format to save bandwidth.
            </DevNote>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {media.map(item => (
                    <div key={item.id} className="group relative bg-nexus-main border border-nexus-border rounded-lg p-2 hover:border-nexus-primary transition-all">
                        <div className="aspect-square bg-black/50 rounded overflow-hidden mb-2">
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-xs font-bold text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-500">{item.size}</div>
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
                            <Button size="sm" variant="secondary" onClick={() => alert(`Copied: ${item.url}`)} icon={Copy}>Copy URL</Button>
                            <Button size="sm" variant="danger" onClick={() => setMedia(media.filter(m => m.id !== item.id))} icon={Trash2}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
    
    if (subTab === 'THEMES') return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GenericModule<ThemeConfig> 
                title="Installed Themes" 
                data={themes} 
                columns={[
                    {key:'name', label:'Theme'}, 
                    {key:'mode', label:'Mode', render: t => <Badge variant={t.mode==='dark'?'purple':'outline'}>{t.mode.toUpperCase()}</Badge>},
                    {key:'active', label:'Active', render: t => <Badge variant={t.active?'success':'warning'}>{t.active ? 'Active' : 'Installed'}</Badge>}
                ]} 
                fields={[]} 
                onSave={()=>{}} 
                onDelete={()=>{}} 
            />
            
            <Card title="Theme Customizer">
                <div className="space-y-6">
                    <DevNote title="CSS Variables Injection">
                        Selected colors must be saved to `theme_config` table. <br/>
                        On frontend initialization, fetch these config values and inject them into the `:root` CSS selector to apply the branding globally.
                    </DevNote>
                    <div className="flex gap-4 p-2 bg-nexus-main rounded border border-nexus-border">
                        <button 
                            onClick={() => { setSelectedThemeMode('dark'); setActiveThemeConfig(themes[0].colors) }}
                            className={`flex-1 py-2 rounded flex items-center justify-center gap-2 font-bold ${selectedThemeMode === 'dark' ? 'bg-nexus-card border border-nexus-primary text-white' : 'text-gray-500'}`}
                        >
                            <Moon size={16}/> Dark Mode
                        </button>
                        <button 
                             onClick={() => { setSelectedThemeMode('light'); setActiveThemeConfig(themes[1].colors) }}
                             className={`flex-1 py-2 rounded flex items-center justify-center gap-2 font-bold ${selectedThemeMode === 'light' ? 'bg-white text-black border border-gray-300' : 'text-gray-500'}`}
                        >
                            <Sun size={16}/> Light Mode
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Main Background</label>
                            <div className="flex gap-2">
                                <input type="color" value={activeThemeConfig.main} onChange={e => setActiveThemeConfig({...activeThemeConfig, main: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-none" />
                                <Input value={activeThemeConfig.main} onChange={e => setActiveThemeConfig({...activeThemeConfig, main: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Card Background</label>
                            <div className="flex gap-2">
                                <input type="color" value={activeThemeConfig.card} onChange={e => setActiveThemeConfig({...activeThemeConfig, card: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-none" />
                                <Input value={activeThemeConfig.card} onChange={e => setActiveThemeConfig({...activeThemeConfig, card: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Primary Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={activeThemeConfig.primary} onChange={e => setActiveThemeConfig({...activeThemeConfig, primary: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-none" />
                                <Input value={activeThemeConfig.primary} onChange={e => setActiveThemeConfig({...activeThemeConfig, primary: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Border Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={activeThemeConfig.border} onChange={e => setActiveThemeConfig({...activeThemeConfig, border: e.target.value})} className="h-10 w-10 rounded cursor-pointer bg-transparent border-none" />
                                <Input value={activeThemeConfig.border} onChange={e => setActiveThemeConfig({...activeThemeConfig, border: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded border border-dashed border-gray-600">
                        <h4 className="text-sm font-bold text-white mb-2">Live Preview (CSS Variables)</h4>
                        <div className="p-4 rounded border transition-colors duration-300" style={{
                            backgroundColor: activeThemeConfig.card, 
                            borderColor: activeThemeConfig.border,
                        }}>
                            <span style={{color: activeThemeConfig.primary}} className="font-bold">Theme Preview Component</span>
                            <p className="text-gray-400 text-sm mt-1" style={{ color: selectedThemeMode === 'light' ? '#64748b' : '#9ca3af' }}>This is how your components will look.</p>
                            <button className="mt-3 px-3 py-1.5 rounded text-white text-xs font-bold" style={{backgroundColor: activeThemeConfig.primary}}>Primary Button</button>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={applyThemePreview}>Test Live</Button>
                        <Button icon={Save} onClick={() => alert("Theme configuration saved to database!")}>Save Theme</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
    
    if (subTab === 'EMAILS') return (
        <Card title="Email Templates" action={<Button icon={Save}>Save Template</Button>}>
            <div className="space-y-4">
                <Select label="Select Template" value={emailTemplate.id} onChange={e => setEmailTemplate({...emailTemplate, id: e.target.value})}>
                    <option value="welcome">Welcome Email</option>
                    <option value="order_conf">Order Confirmation</option>
                    <option value="reset_pass">Reset Password</option>
                </Select>
                <Input label="Subject Line" value={emailTemplate.subject} onChange={e => setEmailTemplate({...emailTemplate, subject: e.target.value})} />
                <div className="flex gap-2 mb-2">
                    <Button size="sm" variant="secondary" onClick={() => setEmailTemplate({...emailTemplate, body: emailTemplate.body + '{username}'})}>{`{username}`}</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEmailTemplate({...emailTemplate, body: emailTemplate.body + '{link}'})}>{`{link}`}</Button>
                </div>
                <TextArea label="HTML Body" value={emailTemplate.body} onChange={e => setEmailTemplate({...emailTemplate, body: e.target.value})} rows={8} className="font-mono text-xs" />
            </div>
        </Card>
    );

    if (subTab === 'SEO') return (
        <div className="space-y-8">
            <Card title="Global SEO Settings" action={<Button icon={Save}>Update Meta</Button>}>
                <div className="space-y-4">
                    <DevNote title="SEO Meta Injection">
                        Values configured here should populate the `&lt;head&gt;` of the application wrapper (Next.js `Head` or React Helmet).
                    </DevNote>
                    <Input label="Site Meta Title" value={seoConfig.title} onChange={e => setSeoConfig({...seoConfig, title: e.target.value})} />
                    <TextArea label="Meta Description" value={seoConfig.description} onChange={e => setSeoConfig({...seoConfig, description: e.target.value})} rows={3} />
                    <Input label="Global Keywords (comma separated)" value={seoConfig.keywords} onChange={e => setSeoConfig({...seoConfig, keywords: e.target.value})} />
                </div>
            </Card>

            <Card title="Advanced Crawler Config">
                <div className="space-y-4">
                    <TextArea label="Robots.txt Content" value={seoConfig.robotsTxt} onChange={e => setSeoConfig({...seoConfig, robotsTxt: e.target.value})} rows={5} className="font-mono" />
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Last Sitemap generated: 2 hours ago</p>
                        <Button variant="secondary" icon={RefreshCw} onClick={generateSitemap}>Regenerate Sitemap.xml</Button>
                    </div>
                </div>
            </Card>
        </div>
    );

    if (subTab === 'LOCALIZATION') return (
        <Card title="Localization Manager">
            <div className="space-y-4">
                <h3 className="font-bold text-white text-sm uppercase">Supported Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map(lang => (
                        <div key={lang.code} className="bg-nexus-main p-4 rounded-lg border border-nexus-border flex justify-between items-center">
                            <span className="text-white font-bold">{lang.name} ({lang.code.toUpperCase()})</span>
                            <Checkbox label="Active" checked={lang.active} onChange={() => toggleLanguage(lang.code)} />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );

    return <div>Select Content Module</div>;
}
