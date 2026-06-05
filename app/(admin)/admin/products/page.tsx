"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { 
    Search, 
    Plus, 
    Upload, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Loader2, 
    Package, 
    Coins, 
    TrendingUp, 
    Layers, 
    HelpCircle, 
    ChevronRight, 
    FileText, 
    Edit, 
    Trash2, 
    RefreshCw, 
    X,
    Filter,
    Check
} from "lucide-react"

interface ProductVariant {
    id: string
    condition: "NM" | "LP" | "MP" | "HP" | "DAMAGED" | "SEALED"
    isFoil: boolean
    language: string
    price: string
    inventory?: {
        quantity: number
    }
}

interface Product {
    id: string
    name: string
    game: string
    set: string | null
    collectorNumber: string | null
    price: string | null
    images: string[]
    variants: ProductVariant[]
}

interface ParsedCard {
    id: string
    name: string
    set: string
    collectorNumber: string
    condition: string
    isFoil: boolean
    language: string
    quantity: number
    price: number
    game: string
    status: "pending" | "verifying" | "matched" | "unmatched"
    error?: string
    verificationDetails?: {
        source: string
        oracleId: string | null
        image: string | null
        game: string
        price: number
        exists: boolean
        productId?: string
    } | null
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [gameFilter, setGameFilter] = useState("ALL")
    const [stockFilter, setStockFilter] = useState("ALL")
    
    // Import Modal & Wizard State
    const [importOpen, setImportOpen] = useState(false)
    const [importTab, setImportTab] = useState<"guide" | "upload" | "review" | "progress">("guide")
    const [parsedCards, setParsedCards] = useState<ParsedCard[]>([])
    const [verifyProgress, setVerifyProgress] = useState(0)
    const [isVerifying, setIsVerifying] = useState(false)
    const [importProgress, setImportProgress] = useState(0)
    const [isImporting, setIsImporting] = useState(false)
    const [importLogs, setImportLogs] = useState<{ successes: number; failures: number; details: string[] } | null>(null)
    const [defaultGame, setDefaultGame] = useState("MTG")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(res.data)
            setFilteredProducts(res.data)
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        let result = products

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(p => 
                p.name.toLowerCase().includes(term) || 
                (p.set && p.set.toLowerCase().includes(term)) ||
                (p.collectorNumber && p.collectorNumber.includes(term))
            )
        }

        if (gameFilter !== "ALL") {
            const term = gameFilter.toLowerCase()
            result = result.filter(p => (p.game || '').toLowerCase() === term)
        }

        if (stockFilter !== "ALL") {
            result = result.filter(p => {
                const totalStock = p.variants.reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0)
                return stockFilter === "IN_STOCK" ? totalStock > 0 : totalStock === 0
            })
        }

        setFilteredProducts(result)
    }, [searchTerm, gameFilter, stockFilter, products])

    // CSV Parsing Utility
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            if (!text) return

            const lines = text.split(/\r?\n/)
            if (lines.length < 2) {
                alert("The selected file is empty or missing headers.")
                return
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())
            
            // Flexibly detect headers
            const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('title') || h === 'card')
            const setIdx = headers.findIndex(h => h.includes('set') || h.includes('expansion') || h.includes('edition'))
            const numIdx = headers.findIndex(h => h.includes('number') || h.includes('cn') || h === 'no' || h === '#')
            const qtyIdx = headers.findIndex(h => h.includes('qty') || h.includes('quantity') || h.includes('count') || h === 'cnt')
            const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('cost') || h.includes('usd') || h.includes('market'))
            const condIdx = headers.findIndex(h => h.includes('condition') || h.includes('cond'))
            const foilIdx = headers.findIndex(h => h.includes('foil') || h.includes('printing') || h.includes('finish') || h.includes('foil?'))
            const langIdx = headers.findIndex(h => h.includes('language') || h.includes('lang'))
            const gameIdx = headers.findIndex(h => h.includes('game') || h.includes('product line') || h.includes('category'))

            if (nameIdx === -1) {
                alert("Could not detect a 'Card Name' or 'Title' column in your CSV headers.")
                return
            }

            const cards: ParsedCard[] = []

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim()
                if (!line) continue

                // Custom parser to split by commas while respecting quotes
                const values: string[] = []
                let insideQuote = false;
                let entry = '';
                
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    if (char === '"') {
                        insideQuote = !insideQuote;
                    } else if (char === ',' && !insideQuote) {
                        values.push(entry.trim().replace(/^"|"$/g, ''));
                        entry = '';
                    } else {
                        entry += char;
                    }
                }
                values.push(entry.trim().replace(/^"|"$/g, ''));

                if (values.length === 0 || !values[nameIdx]) continue

                // Normalize fields
                const condVal = condIdx !== -1 ? values[condIdx]?.toUpperCase().trim() || 'NM' : 'NM'
                let condition: ParsedCard["condition"] = 'NM'
                if (condVal.includes('NEAR MINT') || condVal === 'NM') condition = 'NM'
                else if (condVal.includes('LIGHT') || condVal === 'LP') condition = 'LP'
                else if (condVal.includes('MODERATE') || condVal === 'MP') condition = 'MP'
                else if (condVal.includes('HEAVY') || condVal === 'HP') condition = 'HP'
                else if (condVal.includes('DAMAGE') || condVal === 'DMG' || condVal === 'DAMAGED') condition = 'DAMAGED'
                else if (condVal.includes('SEALED')) condition = 'SEALED'

                const foilVal = foilIdx !== -1 ? values[foilIdx]?.toLowerCase().trim() || '' : ''
                const isFoil = foilVal.includes('foil') || foilVal === 'yes' || foilVal === 'true' || foilVal === '1' || foilVal === 'y'

                cards.push({
                    id: `${i}-${Date.now()}`,
                    name: values[nameIdx] || '',
                    set: setIdx !== -1 ? values[setIdx] || '' : '',
                    collectorNumber: numIdx !== -1 ? values[numIdx] || '' : '',
                    quantity: qtyIdx !== -1 ? parseInt(values[qtyIdx]) || 1 : 1,
                    price: priceIdx !== -1 ? parseFloat(values[priceIdx]) || 0 : 0,
                    condition,
                    isFoil,
                    language: langIdx !== -1 ? values[langIdx] || 'English' : 'English',
                    game: gameIdx !== -1 ? values[gameIdx] || defaultGame : defaultGame,
                    status: 'pending',
                    verificationDetails: null
                })
            }

            setParsedCards(cards)
            setImportTab("review")
        }
        reader.readAsText(file)
    }

    // Run verification lookups row-by-row to show progress and handle API constraints
    const runVerification = async () => {
        if (parsedCards.length === 0) return
        setIsVerifying(true)
        setVerifyProgress(0)

        const token = Cookies.get("tcg-shop-token")
        const updated = [...parsedCards]

        for (let i = 0; i < updated.length; i++) {
            const card = updated[i]
            card.status = 'verifying'
            setParsedCards([...updated])

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/import/lookup`,
                    {
                        name: card.name,
                        set: card.set,
                        collectorNumber: card.collectorNumber,
                        game: card.game || defaultGame
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                )

                const data = res.data
                card.verificationDetails = {
                    source: data.source,
                    oracleId: data.oracleId,
                    image: data.image,
                    game: data.game,
                    price: data.price,
                    exists: data.exists,
                    productId: data.productId
                }
                card.status = data.source === 'unmatched' ? 'unmatched' : 'matched'
                if (data.source !== 'unmatched') {
                    // Update to official name/set from API lookup if matched
                    card.name = data.name
                    card.set = data.set || card.set
                    card.collectorNumber = data.collectorNumber || card.collectorNumber
                    if (card.price === 0 && data.price > 0) {
                        card.price = data.price
                    }
                }
            } catch (err: any) {
                console.error(`Lookup failed for row ${i}:`, err)
                card.status = 'unmatched'
                card.error = err.response?.data?.message || err.message
            }

            setVerifyProgress(Math.round(((i + 1) / updated.length) * 100))
            // Minor delay to avoid excessive burst calls to external APIs
            await new Promise((resolve) => setTimeout(resolve, 80))
        }

        setParsedCards(updated)
        setIsVerifying(false)
    }

    // Confirm Import - submit cards in batch
    const commitImport = async () => {
        setIsImporting(true)
        setImportTab("progress")
        setImportProgress(0)
        setImportLogs(null)

        const token = Cookies.get("tcg-shop-token")
        
        // Chunk cards into batches of 15 to balance transactional safety and connection limits
        const chunkSize = 15
        const itemsToImport = parsedCards.map(c => ({
            name: c.name,
            game: c.game || defaultGame,
            set: c.set || null,
            collectorNumber: c.collectorNumber || null,
            oracleId: c.verificationDetails?.oracleId || null,
            image: c.verificationDetails?.image || null,
            price: c.price,
            variants: [
                {
                    condition: c.condition,
                    isFoil: c.isFoil,
                    language: c.language,
                    price: c.price,
                    quantity: c.quantity
                }
            ]
        }))

        let successes = 0
        let failures = 0
        const details: string[] = []

        for (let i = 0; i < itemsToImport.length; i += chunkSize) {
            const chunk = itemsToImport.slice(i, i + chunkSize)
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/import/batch`,
                    { items: chunk },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                
                successes += res.data.importedCount
                failures += res.data.failedCount
                
                res.data.results.forEach((r: any) => {
                    details.push(`✅ Imported "${r.name}" successfully.`)
                })
                res.data.errors.forEach((e: any) => {
                    details.push(`❌ Failed to import "${e.name}": ${e.error}`)
                })
            } catch (err: any) {
                console.error("Batch chunk submission failed:", err)
                failures += chunk.length
                chunk.forEach(item => {
                    details.push(`❌ Failed chunk import for "${item.name}": ${err.message}`)
                })
            }

            setImportProgress(Math.round((Math.min(i + chunkSize, itemsToImport.length) / itemsToImport.length) * 100))
        }

        setImportLogs({ successes, failures, details })
        setIsImporting(false)
        fetchProducts() // Refresh catalog
    }

    // Helpers
    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product? This will permanently delete all variants and inventory associated with it.")) return
        try {
            const token = Cookies.get("tcg-shop-token")
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error("Failed to delete product:", error)
            alert("Failed to delete product. Please try again.")
        }
    }

    const updateParsedCardField = (id: string, field: keyof ParsedCard, value: any) => {
        setParsedCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    }

    // Catalog Metrics
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => 
        sum + p.variants.reduce((vSum, v) => vSum + (v.inventory?.quantity || 0), 0)
    , 0)
    const outOfStockCount = products.filter(p => 
        p.variants.reduce((vSum, v) => vSum + (v.inventory?.quantity || 0), 0) === 0
    ).length
    const uniqueSets = new Set(products.map(p => p.set).filter(Boolean)).size

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Products Catalog</h1>
                    <p className="text-sm text-neutral-400 mt-1">Manage single cards, track inventory stock, and sync TCG files.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setImportTab("guide")
                            setParsedCards([])
                            setImportLogs(null)
                            setImportOpen(true)
                        }}
                        className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        <Upload size={14} />
                        <span>CSV Import / Sync</span>
                    </button>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-purple-500/10 pointer-events-none">
                        <Package size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Total Catalog Cards</p>
                    <p className="text-3xl font-black text-white mt-2">{totalProducts}</p>
                    <p className="text-[10px] text-neutral-400 mt-2">Unique printings in store</p>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-blue-500/10 pointer-events-none">
                        <Layers size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Total Inventory Stock</p>
                    <p className="text-3xl font-black text-white mt-2">{totalStock}</p>
                    <p className="text-[10px] text-blue-400 mt-2">Sum of all condition variants</p>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-500/10 pointer-events-none">
                        <AlertCircle size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Out of Stock</p>
                    <p className="text-3xl font-black text-white mt-2">{outOfStockCount}</p>
                    <p className="text-[10px] text-amber-400 mt-2">Products with 0 quantity</p>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500/10 pointer-events-none">
                        <Coins size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Sets Represented</p>
                    <p className="text-3xl font-black text-white mt-2">{uniqueSets}</p>
                    <p className="text-[10px] text-emerald-400 mt-2">Active card expansions</p>
                </div>
            </div>

            {/* Filter and search controls */}
            <div className="bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search by card name, set, or collector number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800/80 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl pl-10 pr-4 h-10 text-sm transition-all"
                    />
                </div>

                {/* Filter buttons */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="flex gap-1.5">
                        {["ALL", "MTG", "POKEMON"].map((game) => (
                            <button
                                key={game}
                                onClick={() => setGameFilter(game)}
                                className={`
                                    px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                    ${gameFilter === game 
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/15" 
                                        : "bg-neutral-900/50 text-neutral-400 hover:text-white border border-neutral-800/60"
                                    }
                                `}
                            >
                                {game === "ALL" ? "All Games" : game === "MTG" ? "Magic" : "Pokémon"}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-1.5 border-t border-neutral-800 md:border-t-0 pt-2 md:pt-0">
                        {["ALL", "IN_STOCK", "OUT_OF_STOCK"].map((stock) => (
                            <button
                                key={stock}
                                onClick={() => setStockFilter(stock)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-250
                                    ${stockFilter === stock 
                                        ? "bg-neutral-800 text-purple-300 border border-purple-500/30" 
                                        : "bg-neutral-900/50 text-neutral-400 hover:text-white border border-neutral-800/60"
                                    }
                                `}
                            >
                                {stock === "ALL" ? "All Inventory" : stock === "IN_STOCK" ? "In Stock" : "Out of Stock"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
                        <span className="text-sm">Fetching catalog...</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-neutral-500 text-center px-4">
                        <Package size={48} className="text-neutral-700 mb-3" />
                        <p className="text-base font-semibold text-neutral-300">No cards in catalog</p>
                        <p className="text-xs text-neutral-500 mt-1">Try searching another term, or import card CSVs above.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-800/80 text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-900/50">
                                    <th className="py-4 px-6 font-bold">Card Details</th>
                                    <th className="py-4 px-6 font-bold">Game</th>
                                    <th className="py-4 px-6 font-bold">Set / Collector #</th>
                                    <th className="py-4 px-6 font-bold text-right">Base Price</th>
                                    <th className="py-4 px-6 font-bold text-center">Variants & Stock</th>
                                    <th className="py-4 px-6 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/40 text-sm">
                                {filteredProducts.map((product) => {
                                    const totalQty = product.variants.reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0)
                                    return (
                                        <tr key={product.id} className="hover:bg-white/[0.01] transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-14 bg-neutral-950 rounded border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                                                        {product.images?.[0] ? (
                                                            <img 
                                                                src={product.images[0]} 
                                                                alt={product.name} 
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = ""
                                                                }}
                                                            />
                                                        ) : (
                                                            <Package size={16} className="text-neutral-600" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-white truncate max-w-[280px]">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-neutral-400 mt-0.5">
                                                            {product.variants.length} printing variations
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-semibold uppercase text-xs tracking-wider text-neutral-300">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] ${
                                                    (product.game || '').toUpperCase() === 'POKEMON' 
                                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
                                                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                }`}>
                                                    {product.game || 'MTG'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-white font-medium max-w-[200px] truncate">{product.set || "—"}</div>
                                                <div className="text-xs text-neutral-500 font-mono mt-0.5">#{product.collectorNumber || "000"}</div>
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-white">
                                                ${product.price ? Number(product.price).toFixed(2) : "0.00"}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                        totalQty > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                                    }`}>
                                                        {totalQty} in stock
                                                    </div>
                                                    <div className="flex flex-wrap justify-center gap-1 max-w-[150px] mt-1.5">
                                                        {product.variants.slice(0, 3).map((v) => (
                                                            <span key={v.id} className="text-[9px] font-semibold text-neutral-400 bg-neutral-850 px-1.5 py-0.5 rounded uppercase">
                                                                {v.condition} {v.isFoil ? "F" : "NF"} ({v.inventory?.quantity || 0})
                                                            </span>
                                                        ))}
                                                        {product.variants.length > 3 && (
                                                            <span className="text-[9px] font-semibold text-neutral-500 bg-neutral-850 px-1 py-0.5 rounded">
                                                                +{product.variants.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CSV Import Modal (Wizard Layout) */}
            {importOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-[#09090B] border border-neutral-800/80 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                        
                        {/* Ambient glows inside modal */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-neutral-800/80 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Upload size={18} className="text-purple-400" />
                                    <span>CSV Catalog Import Wizard</span>
                                </h3>
                                <p className="text-xs text-neutral-400 mt-1">Import sifter scanning output or TCGplayer seller exports.</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (isImporting || isVerifying) {
                                        if (!confirm("An operation is in progress. Closing now will interrupt the import. Proceed?")) return
                                    }
                                    setImportOpen(false)
                                }}
                                className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Step Navigation Bar */}
                        <div className="px-6 py-3 bg-neutral-950 border-b border-neutral-900 flex gap-6 z-10 overflow-x-auto">
                            {[
                                { key: "guide", label: "1. Export Guide" },
                                { key: "upload", label: "2. Upload CSV" },
                                { key: "review", label: "3. Review & Match" },
                                { key: "progress", label: "4. Synchronize" }
                            ].map((step, idx) => {
                                const isActive = importTab === step.key
                                const isPassed = 
                                    (step.key === "guide" && importTab !== "guide") ||
                                    (step.key === "upload" && ["review", "progress"].includes(importTab)) ||
                                    (step.key === "review" && importTab === "progress" && !isImporting)
                                
                                return (
                                    <div key={step.key} className="flex items-center gap-2 shrink-0">
                                        <button
                                            disabled={step.key === "progress" && parsedCards.length === 0}
                                            onClick={() => setImportTab(step.key as any)}
                                            className={`text-xs font-bold tracking-wide transition-all ${
                                                isActive 
                                                    ? "text-purple-400 font-extrabold" 
                                                    : isPassed 
                                                        ? "text-emerald-400" 
                                                        : "text-neutral-500 hover:text-neutral-300"
                                            }`}
                                        >
                                            {step.label}
                                        </button>
                                        {idx < 3 && <ChevronRight size={12} className="text-neutral-700" />}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Content Scroll Area */}
                        <div className="p-6 overflow-y-auto flex-1 z-10">
                            
                            {/* TAB 1: GUIDE */}
                            {importTab === "guide" && (
                                <div className="space-y-6">
                                    <div className="bg-purple-950/20 border border-purple-500/25 rounded-xl p-5 flex items-start gap-4">
                                        <HelpCircle className="text-purple-400 shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <h4 className="text-sm font-bold text-white">How this works</h4>
                                            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                                                Our importer matches card scans and vendor listings against Scryfall and Pokemon TCG databases. By feeding your sifter output or TCGplayer pricing sheet, we map the metadata (prints, card images, mana values, types) and add them to your storefront catalog instantly.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-5 space-y-4">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-800/80 pb-2">
                                                <FileText size={16} className="text-blue-400" />
                                                <span>Exporting from TCGplayer</span>
                                            </h4>
                                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-2 leading-relaxed">
                                                <li>Log in to your <strong>TCGplayer Seller Portal</strong>.</li>
                                                <li>Navigate to <strong>Inventory</strong> &rarr; <strong>Pricing &amp; Inventory</strong>.</li>
                                                <li>Filter by product line (e.g. Magic or Pokemon) if desired.</li>
                                                <li>Click the <strong>Export CSV</strong> button in the top right to download.</li>
                                                <li>The CSV will contain columns like <code className="text-blue-300">Title</code>, <code className="text-blue-300">Set Name</code>, and <code className="text-blue-300">Quantity</code> which we parse automatically.</li>
                                            </ol>
                                        </div>

                                        <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-5 space-y-4">
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-neutral-800/80 pb-2">
                                                <FileText size={16} className="text-yellow-400" />
                                                <span>Exporting from Roca Sifter</span>
                                            </h4>
                                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-2 leading-relaxed">
                                                <li>Scan your card singles through the <strong>Roca Sifter</strong> machine.</li>
                                                <li>Once sorted, click <strong>Export Session Data</strong> in the Roca client.</li>
                                                <li>Select the <strong>Standard CSV (.csv)</strong> format.</li>
                                                <li>Save the session output to your computer.</li>
                                                <li>The file contains columns for <code className="text-yellow-300">Card Name</code>, <code className="text-yellow-300">Collector Number</code>, and <code className="text-yellow-300">Foil</code>.</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-neutral-900">
                                        <button
                                            onClick={() => setImportTab("upload")}
                                            className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                                        >
                                            Next: Upload CSV File
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: UPLOAD */}
                            {importTab === "upload" && (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-950/20 text-center px-4 hover:border-purple-500/40 transition-colors">
                                        <Upload size={32} className="text-neutral-500 mb-4" />
                                        <h4 className="text-sm font-bold text-white">Select your CSV File</h4>
                                        <p className="text-xs text-neutral-500 mt-1.5 max-w-sm leading-relaxed">
                                            Drag &amp; drop your exported sifter or TCGplayer CSV here, or browse local files.
                                        </p>
                                        
                                        <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                                            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300">
                                                <span>Default Game Type:</span>
                                                <select
                                                    value={defaultGame}
                                                    onChange={(e) => setDefaultGame(e.target.value)}
                                                    className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
                                                >
                                                    <option value="MTG" className="bg-[#09090B]">Magic: The Gathering</option>
                                                    <option value="POKEMON" className="bg-[#09090B]">Pokémon</option>
                                                </select>
                                            </div>

                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="h-9 px-4 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all"
                                            >
                                                Choose File
                                            </button>
                                        </div>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept=".csv"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: REVIEW & EDIT */}
                            {importTab === "review" && (
                                <div className="space-y-6">
                                    {/* Sub-actions toolbar */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-neutral-950 border border-neutral-900 p-4 rounded-xl">
                                        <div className="text-xs text-neutral-400">
                                            Parsed <strong className="text-white">{parsedCards.length}</strong> cards from CSV. Select <strong>Verify Matches</strong> to lookup images and sets.
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={runVerification}
                                                disabled={isVerifying || parsedCards.length === 0}
                                                className="h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {isVerifying ? (
                                                    <>
                                                        <Loader2 size={12} className="animate-spin" />
                                                        <span>Verifying ({verifyProgress}%)</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw size={12} />
                                                        <span>Verify Matches</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={commitImport}
                                                disabled={isVerifying || isImporting || parsedCards.length === 0}
                                                className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                <span>Import Catalog ({parsedCards.length})</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Interactive Review Grid */}
                                    <div className="border border-neutral-850 rounded-xl overflow-hidden max-h-[45vh] overflow-y-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-neutral-950 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-850 sticky top-0 z-20">
                                                    <th className="py-3 px-4 text-center w-12">Row</th>
                                                    <th className="py-3 px-4 w-24">Status</th>
                                                    <th className="py-3 px-4 w-12 text-center">Image</th>
                                                    <th className="py-3 px-4 min-w-[200px]">Card Name</th>
                                                    <th className="py-3 px-4 w-32">Set</th>
                                                    <th className="py-3 px-4 w-20 text-center">Collector #</th>
                                                    <th className="py-3 px-4 w-20 text-center">Cond</th>
                                                    <th className="py-3 px-4 w-14 text-center">Foil</th>
                                                    <th className="py-3 px-4 w-16 text-right">Qty</th>
                                                    <th className="py-3 px-4 w-20 text-right">Price ($)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-900 bg-neutral-950/20 text-neutral-300">
                                                {parsedCards.map((card, index) => {
                                                    const isMatched = card.status === 'matched'
                                                    const isVerifyingRow = card.status === 'verifying'
                                                    const isUnmatched = card.status === 'unmatched'

                                                    return (
                                                        <tr key={card.id} className="hover:bg-white/[0.01] transition-colors">
                                                            <td className="py-2.5 px-4 text-center font-mono text-neutral-500">
                                                                {index + 1}
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                {isMatched ? (
                                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                        <Check size={10} />
                                                                        <span>Matched</span>
                                                                    </span>
                                                                ) : isVerifyingRow ? (
                                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                                                        <Loader2 size={10} className="animate-spin" />
                                                                        <span>Checking</span>
                                                                    </span>
                                                                ) : isUnmatched ? (
                                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20" title={card.error || "No match found"}>
                                                                        <X size={10} />
                                                                        <span>Unmatched</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                                                                        <span>Pending</span>
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-2.5 px-4 text-center">
                                                                <div className="w-8 h-11 bg-neutral-950 border border-neutral-850 rounded overflow-hidden flex items-center justify-center mx-auto">
                                                                    {card.verificationDetails?.image ? (
                                                                        <img src={card.verificationDetails.image} alt={card.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package size={12} className="text-neutral-700" />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                <input
                                                                    type="text"
                                                                    value={card.name}
                                                                    onChange={(e) => updateParsedCardField(card.id, "name", e.target.value)}
                                                                    className="bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none w-full text-white font-medium focus:bg-neutral-900 px-1 py-0.5 rounded"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                <input
                                                                    type="text"
                                                                    value={card.set}
                                                                    onChange={(e) => updateParsedCardField(card.id, "set", e.target.value)}
                                                                    className="bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none w-full text-neutral-300 font-mono text-[10px] focus:bg-neutral-900 px-1 py-0.5 rounded"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4 text-center">
                                                                <input
                                                                    type="text"
                                                                    value={card.collectorNumber}
                                                                    onChange={(e) => updateParsedCardField(card.id, "collectorNumber", e.target.value)}
                                                                    className="bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none w-full text-center font-mono text-neutral-400 focus:bg-neutral-900 px-1 py-0.5 rounded"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4 text-center">
                                                                <select
                                                                    value={card.condition}
                                                                    onChange={(e) => updateParsedCardField(card.id, "condition", e.target.value)}
                                                                    className="bg-neutral-900 text-purple-300 border border-neutral-800 rounded font-semibold text-[10px] px-1 py-0.5 focus:outline-none cursor-pointer"
                                                                >
                                                                    {["NM", "LP", "MP", "HP", "DAMAGED", "SEALED"].map(cond => (
                                                                        <option key={cond} value={cond}>{cond}</option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td className="py-2.5 px-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={card.isFoil}
                                                                    onChange={(e) => updateParsedCardField(card.id, "isFoil", e.target.checked)}
                                                                    className="rounded border-neutral-800 text-purple-600 bg-neutral-950 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    value={card.quantity}
                                                                    min={1}
                                                                    onChange={(e) => updateParsedCardField(card.id, "quantity", parseInt(e.target.value) || 1)}
                                                                    className="bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none w-12 text-right text-white font-bold focus:bg-neutral-900 px-1 py-0.5 rounded"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={card.price}
                                                                    min={0}
                                                                    onChange={(e) => updateParsedCardField(card.id, "price", parseFloat(e.target.value) || 0)}
                                                                    className="bg-transparent border-b border-transparent focus:border-purple-500 focus:outline-none w-16 text-right text-white font-bold focus:bg-neutral-900 px-1 py-0.5 rounded"
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: SYNCHRONIZATION PROGRESS */}
                            {importTab === "progress" && (
                                <div className="space-y-8 py-6">
                                    {isImporting ? (
                                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                                            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                                            <h4 className="text-base font-bold text-white">Importing Products to Catalog...</h4>
                                            <p className="text-xs text-neutral-500 max-w-sm">
                                                Upserting printings, generating unique SKUs, and updating inventory items.
                                            </p>
                                            
                                            <div className="w-full max-w-md bg-neutral-900 h-2.5 rounded-full overflow-hidden mt-4">
                                                <div 
                                                    className="bg-purple-600 h-full transition-all duration-300 rounded-full"
                                                    style={{ width: `${importProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-purple-400 font-bold">{importProgress}% completed</span>
                                        </div>
                                    ) : importLogs ? (
                                        <div className="space-y-6">
                                            {/* Import summary card */}
                                            <div className="grid grid-cols-3 gap-6 bg-neutral-950 p-5 rounded-xl border border-neutral-900 text-center">
                                                <div>
                                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Imported</p>
                                                    <p className="text-3xl font-black text-white mt-1.5">{importLogs.successes + importLogs.failures}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Successful</p>
                                                    <p className="text-3xl font-black text-emerald-400 mt-1.5">{importLogs.successes}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Failed / Skipped</p>
                                                    <p className="text-3xl font-black text-rose-400 mt-1.5">{importLogs.failures}</p>
                                                </div>
                                            </div>

                                            {/* Transaction Logs */}
                                            <div className="space-y-2.5">
                                                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Synchronization Logs</h4>
                                                <div className="bg-neutral-950/80 border border-neutral-900 rounded-xl p-4 max-h-[30vh] overflow-y-auto font-mono text-[10px] text-neutral-400 space-y-1.5">
                                                    {importLogs.details.map((detail, idx) => (
                                                        <div key={idx} className="border-b border-neutral-900/50 pb-1 last:border-b-0">
                                                            {detail}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4 border-t border-neutral-900">
                                                <button
                                                    onClick={() => setImportOpen(false)}
                                                    className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                                                >
                                                    Complete Import Workflow
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
