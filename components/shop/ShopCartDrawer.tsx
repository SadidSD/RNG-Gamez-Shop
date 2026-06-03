'use client';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useShopCart } from '@/context/ShopCartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { X, Trash2, ShoppingBag, Truck, Tag } from 'lucide-react';

// ─── Pricing Constants (must match backend) ───────────────────────────────────
const TAX_RATE = 0.06625;            // NJ 6.625%
const SHIPPING_FLAT = 4.99;
const SHIPPING_FREE_THRESHOLD = 75;

export default function ShopCartDrawer() {
    const { isOpen, closeCart, items, removeItem, updateQuantity, total, clearCart } = useShopCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'store_credit'>('stripe');
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        country: 'US',
        zip: ''
    });

    // ─── Computed totals ────────────────────────────────────────────────────────
    const shipping = useMemo(() => total >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT, [total]);
    const tax      = useMemo(() => Math.round(total * TAX_RATE * 100) / 100, [total]);
    const grandTotal = useMemo(() => Math.round((total + tax + shipping) * 100) / 100, [total, tax, shipping]);
    const toFreeShipping = Math.max(0, SHIPPING_FREE_THRESHOLD - total);
    const freeShippingProgress = Math.min(100, (total / SHIPPING_FREE_THRESHOLD) * 100);

    // Auto-fill form data when user is logged in
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            }));
            if (user.creditBalance && user.creditBalance >= grandTotal) {
                setPaymentMethod('store_credit');
            } else {
                setPaymentMethod('stripe');
            }
        }
    }, [user, isOpen, grandTotal]);

    // Reset to cart step when drawer closes
    React.useEffect(() => {
        if (!isOpen) {
            setStep('cart');
            setLoading(false);
            setPaymentMethod('stripe');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCheckout = async () => {
        if (paymentMethod === 'stripe' && grandTotal < 0.50) {
            showToast('Stripe requires a minimum order amount of $0.50. Please add more items to your cart.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                customerEmail: formData.email,
                customerFirstName: formData.firstName,
                customerLastName: formData.lastName,
                shippingAddress: formData.address,
                shippingCity: formData.city,
                shippingState: formData.state,
                shippingCountry: formData.country,
                shippingZip: formData.zip,
                paymentMethod: paymentMethod,
                items: items.map(i => ({
                    variantId: i.variantId,
                    quantity: i.quantity
                }))
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await axios.post(`${apiUrl}/orders`, payload, {
                headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
            });

            if (res.data && res.data.stripeSessionUrl) {
                clearCart();
                window.location.href = res.data.stripeSessionUrl;
            } else {
                setStep('success');
                clearCart();
            }
        } catch (error: any) {
            console.error('Checkout failed', error);
            const msg = error.response?.data?.message || 'Failed to place order.';
            showToast(`Order Failed: ${Array.isArray(msg) ? msg.join(', ') : msg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Overlay onClick={closeCart} />
            <Drawer>
                <Header>
                    <Title>Your Cart ({items.length})</Title>
                    <CloseButton onClick={closeCart}>
                        <X size={24} />
                    </CloseButton>
                </Header>

                {step === 'cart' && (
                    <>
                        {/* Free shipping progress bar */}
                        {items.length > 0 && (
                            <FreeShippingBanner>
                                <Truck size={14} />
                                {toFreeShipping > 0
                                    ? <span>Add <strong>${toFreeShipping.toFixed(2)}</strong> more for FREE shipping!</span>
                                    : <span style={{ color: '#10b981', fontWeight: 700 }}>🎉 You've unlocked FREE shipping!</span>
                                }
                                <ProgressBarTrack>
                                    <ProgressBarFill style={{ width: `${freeShippingProgress}%` }} />
                                </ProgressBarTrack>
                            </FreeShippingBanner>
                        )}

                        <ItemsList>
                            {items.length === 0 ? (
                                <EmptyState>Your cart is empty.</EmptyState>
                            ) : items.map(item => (
                                <CartItem key={item.variantId}>
                                    <ItemImage src={item.image} alt={item.name} />
                                    <ItemDetails>
                                        <ItemName>{item.name}</ItemName>
                                        <ItemSet>{item.set} - {item.condition}</ItemSet>
                                        <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                                        <QuantityControl>
                                            <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                                        </QuantityControl>
                                    </ItemDetails>
                                    <RemoveButton onClick={() => removeItem(item.variantId)}>
                                        <Trash2 size={18} />
                                    </RemoveButton>
                                </CartItem>
                            ))}
                        </ItemsList>

                        <Footer>
                            {total > 0 && total < 0.50 && paymentMethod === 'stripe' && (
                                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.75rem', textAlign: 'center', fontWeight: '500' }}>
                                    * Minimum order amount is $0.50 for Stripe Card payments
                                </div>
                            )}

                            {/* Cost breakdown */}
                            {items.length > 0 && (
                                <CostBreakdown>
                                    <BreakdownRow>
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </BreakdownRow>
                                    <BreakdownRow>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Truck size={13} />Shipping
                                        </span>
                                        {shipping === 0
                                            ? <ShippingFree>FREE</ShippingFree>
                                            : <span>${shipping.toFixed(2)}</span>
                                        }
                                    </BreakdownRow>
                                    <BreakdownRow>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Tag size={13} />Tax (NJ 6.625%)
                                        </span>
                                        <span>${tax.toFixed(2)}</span>
                                    </BreakdownRow>
                                    <BreakdownDivider />
                                </CostBreakdown>
                            )}

                            <TotalRow>
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </TotalRow>
                            <CheckoutButton onClick={() => {
                                if (!user) {
                                    showToast('Please log in or sign up to complete your checkout.', 'warning');
                                    window.location.href = '/login';
                                    return;
                                }
                                setStep('checkout');
                            }} disabled={items.length === 0}>
                                Checkout
                            </CheckoutButton>
                            {!user && (
                                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'center', fontWeight: '500' }}>
                                    * You must be logged in to place an order
                                </div>
                            )}
                        </Footer>
                    </>
                )}

                {step === 'checkout' && (
                    <CheckoutForm>
                        <h3>Shipping Information</h3>
                        <Input placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <Row>
                            <Input placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                            <Input placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                        </Row>
                        <Input placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        <Row>
                            <Input placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            <Input placeholder="State (e.g. NY)" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                        </Row>
                        <Row>
                            <Input placeholder="ZIP" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                            <Input placeholder="Country (e.g. US)" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
                        </Row>

                        {user && Number(user.creditBalance) > 0 && (
                            <PaymentMethodSection>
                                <h4>Payment Method</h4>
                                <PaymentOptions>
                                    <PaymentOption
                                        type="button"
                                        active={paymentMethod === 'stripe'}
                                        onClick={() => setPaymentMethod('stripe')}
                                    >
                                        Stripe / Credit Card
                                    </PaymentOption>
                                    <PaymentOption
                                        type="button"
                                        active={paymentMethod === 'store_credit'}
                                        disabled={Number(user.creditBalance) < grandTotal}
                                        onClick={() => {
                                            if (Number(user.creditBalance) >= grandTotal) {
                                                setPaymentMethod('store_credit');
                                            }
                                        }}
                                    >
                                        Store Credit (Balance: ${Number(user.creditBalance).toFixed(2)})
                                        {Number(user.creditBalance) < grandTotal && (
                                            <span style={{ color: '#ef4444', display: 'block', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                (Insufficient balance)
                                            </span>
                                        )}
                                    </PaymentOption>
                                </PaymentOptions>
                            </PaymentMethodSection>
                        )}

                        {/* Order summary on checkout step */}
                        <OrderSummaryBox>
                            <SummaryTitle>Order Summary</SummaryTitle>
                            <BreakdownRow>
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </BreakdownRow>
                            <BreakdownRow>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Truck size={13} />Shipping
                                </span>
                                {shipping === 0
                                    ? <ShippingFree>FREE</ShippingFree>
                                    : <span>${shipping.toFixed(2)}</span>
                                }
                            </BreakdownRow>
                            <BreakdownRow>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Tag size={13} />NJ Tax (6.625%)
                                </span>
                                <span>${tax.toFixed(2)}</span>
                            </BreakdownRow>
                            <BreakdownDivider />
                            <BreakdownRow style={{ fontWeight: 700, fontSize: '1rem' }}>
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </BreakdownRow>
                        </OrderSummaryBox>

                        <Footer>
                            {paymentMethod === 'stripe' && grandTotal < 0.50 && (
                                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'center', fontWeight: '500' }}>
                                    * Stripe requires a minimum order amount of $0.50
                                </div>
                            )}
                            <CheckoutButton
                                onClick={handleCheckout}
                                disabled={loading || !formData.email || (paymentMethod === 'stripe' && grandTotal < 0.50)}
                            >
                                {loading ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
                            </CheckoutButton>
                            <BackButton onClick={() => setStep('cart')}>Back to Cart</BackButton>
                        </Footer>
                    </CheckoutForm>
                )}

                {step === 'success' && (
                    <SuccessState>
                        <ShoppingBag size={64} color="#10B981" />
                        <h2>Order Placed!</h2>
                        <p>Thank you for your purchase.</p>
                        <CheckoutButton onClick={() => { setStep('cart'); closeCart(); }}>
                            Continue Shopping
                        </CheckoutButton>
                    </SuccessState>
                )}
            </Drawer>
        </>
    );
}

// ─── Styled Components ─────────────────────────────────────────────────────────
const Overlay = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
`;

const Drawer = styled.div`
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 420px;
    background: white;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    @media(max-width: 500px) { width: 100%; }
`;

const Header = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2` margin: 0; font-size: 1.5rem; `;
const CloseButton = styled.button` background: none; border: none; cursor: pointer; `;

const FreeShippingBanner = styled.div`
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border-bottom: 1px solid #bbf7d0;
    padding: 0.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: #166534;
    svg { color: #16a34a; }
`;

const ProgressBarTrack = styled.div`
    width: 100%;
    height: 5px;
    background: #d1fae5;
    border-radius: 99px;
    overflow: hidden;
`;

const ProgressBarFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 99px;
    transition: width 0.4s ease;
`;

const ItemsList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const EmptyState = styled.div` text-align: center; color: #888; margin-top: 2rem; `;

const CartItem = styled.div`
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f5f5f5;
`;

const ItemImage = styled.img`
    width: 60px; height: 80px; object-fit: contain;
    background: #f9f9f9; border-radius: 4px;
`;

const ItemDetails = styled.div` flex: 1; display: flex; flex-direction: column; gap: 0.25rem; `;
const ItemName = styled.div` font-weight: 600; font-size: 0.9rem; `;
const ItemSet = styled.div` font-size: 0.8rem; color: #666; `;
const ItemPrice = styled.div` font-weight: bold; `;

const QuantityControl = styled.div`
    display: flex; align-items: center; gap: 0.5rem;
    button {
        width: 24px; height: 24px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px;
    }
`;

const RemoveButton = styled.button`
    background: none; border: none; color: #ff4444; cursor: pointer; align-self: center;
`;

const Footer = styled.div`
    padding: 1.25rem;
    border-top: 1px solid #eee;
    background: #fafafa;
`;

const CostBreakdown = styled.div`
    margin-bottom: 0.5rem;
`;

const BreakdownRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.35rem;
`;

const ShippingFree = styled.span`
    color: #10b981;
    font-weight: 700;
    font-size: 0.8rem;
    background: #d1fae5;
    padding: 1px 6px;
    border-radius: 4px;
`;

const BreakdownDivider = styled.div`
    border-top: 1px dashed #e5e7eb;
    margin: 0.5rem 0;
`;

const TotalRow = styled.div`
    display: flex; justify-content: space-between;
    font-size: 1.2rem; font-weight: bold;
    margin-bottom: 1rem;
`;

const CheckoutButton = styled.button`
    width: 100%;
    padding: 1rem;
    background: black;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BackButton = styled.button`
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
`;

const CheckoutForm = styled.div`
    padding: 1.25rem;
    display: flex; flex-direction: column; gap: 0.85rem;
    flex: 1;
    overflow-y: auto;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Row = styled.div` display: flex; gap: 0.75rem; `;

const OrderSummaryBox = styled.div`
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.85rem 1rem;
    margin-top: 0.25rem;
`;

const SummaryTitle = styled.div`
    font-weight: 700;
    font-size: 0.85rem;
    color: #374151;
    margin-bottom: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const SuccessState = styled.div`
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    text-align: center; padding: 2rem;
`;

const PaymentMethodSection = styled.div`
    margin-top: 0.25rem;
    h4 { margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: 600; color: #333; }
`;

const PaymentOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const PaymentOption = styled.button<{ active: boolean; disabled?: boolean }>`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${props => props.active ? 'black' : '#ddd'};
    background: ${props => props.active ? '#f9f9f9' : 'white'};
    border-radius: 6px;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1};
    color: ${props => props.disabled ? '#999' : 'black'};
    transition: all 0.2s ease;
    &:hover {
        background: ${props => props.disabled ? 'white' : '#f9f9f9'};
        border-color: ${props => props.disabled ? '#ddd' : props.active ? 'black' : '#999'};
    }
`;
