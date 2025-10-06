# Quotation Engine - Project Brief

## Project Overview

This is a comprehensive B2B quotation management system built for a manufacturing/distribution company. The application enables sales teams to create, manage, and track quotes for customers across multiple departments, with advanced features for pricing, compliance, product selection, and analytics.

## Business Context

The system serves as a centralized platform for:
- Creating detailed product quotes with multi-step workflows
- Managing customer relationships and order history
- Tracking leads, tasks, and notifications
- Analyzing sales performance and conversion metrics
- Supporting multiple departments (Nutraceuticals, Cosmetics, Food & Beverage, Pharma)
- Handling complex pricing structures with margins, shipping, and payment terms

## Technical Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Context API (Department, Currency, Analytics)
- **Data Visualization**: Recharts 2.15.4
- **Form Management**: React Hook Form with Zod validation
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Architecture Overview

### Application Structure

```
src/
├── components/
│   ├── analytics/          # Analytics dashboard and tracking
│   ├── dashboard/          # Main dashboard components
│   ├── demo/              # Demo utilities (user switcher)
│   ├── layout/            # Header, Sidebar, Department selector
│   ├── quotes/            # Quote creation and management
│   │   ├── steps/         # Multi-step quote workflow
│   │   └── ...            # Quote-related components
│   └── ui/                # Reusable UI components (shadcn)
├── contexts/              # React contexts for global state
├── data/                  # JSON data files (mock data)
├── hooks/                 # Custom React hooks
├── pages/                 # Route pages
└── lib/                   # Utilities
```

### Key Design Patterns

1. **Multi-Step Workflows**: Quote creation uses a step-by-step process with progress tracking
2. **Context-Based State**: Department, currency, and analytics use React Context
3. **Component Composition**: Small, focused components for maintainability
4. **Data-Driven UI**: JSON files provide mock data for development
5. **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Core Features

### 1. Quote Creation (Multi-Step Process)

**Step 1: Customer Selection**
- Search customers by name, ID, email, company
- Display customer details: credit status, payment terms, outstanding balance
- Quick stats: total customers, active accounts
- NetSuite integration links
- Create new customers inline
- **Location**: `src/components/quotes/steps/CustomerSelection.tsx`

**Step 2: Product Selection**
- **Guided Workflow**:
  - Step 1: Select end-use categories (Dietary Supplements, Cosmetics, Food & Beverage, etc.)
  - Step 2: Select compliance requirements (Organic, Kosher, Halal, Non-GMO, etc.)
  - Product filtering based on selections
- **Product Search**: Free-form search across all products
- **Batch Selection**: View and add specific batches with:
  - Batch ID, lot number, expiration date
  - Available quantity, unit price
  - Quality indicators (premium, standard, etc.)
- **Bulk Upload**: CSV upload for large orders
- **Cross-Sell Suggestions**: AI-recommended complementary products
- **Recent Purchases**: Show customer's frequently ordered items
- **Location**: `src/components/quotes/steps/ProductSelection.tsx`

**Step 3: Customer Details**
- **Customer Snapshot**: 
  - Basic info, billing/shipping addresses
  - Credit information, payment terms
  - Account manager, NetSuite ID
- **Customer Order History Search** (NEW):
  - Search by product name or SKU
  - View all past orders containing that product
  - Display: SO#, date, price, quantity, delivery method
  - Helps sales reps reference historical pricing
- **Shipping Methods**: Ground, expedited, air freight, ocean freight, customer pickup
- **Special Instructions**: Custom notes for the order
- **Location**: `src/components/quotes/steps/CustomerDetails.tsx`

**Step 4: Costs & Shipping**
- **Pricing Breakdown**:
  - Subtotal (product costs)
  - Shipping & handling
  - Tax calculations
  - Total amount
- **Margin Display**: Show profit margins
- **CEO Margin Override**: 
  - Custom margin adjustments
  - Landed cost multiplier
  - Shipping markup overrides
  - Reason tracking
  - Apply to customer for future quotes
- **Manual Price Adjustment**: Line-by-line price edits
- **Location**: `src/components/quotes/steps/CostsAndShipping.tsx`

**Step 5: Finalize & Send**
- **Payment Options**: 
  - Credit card, Net 30/60/90, Wire transfer, ACH
  - Show last used payment method
  - Processing time and fees
- **Quote Preview**: PDF-style preview before sending
- **Quote Link Generation**: Shareable link with expiration
- **Deal Packet Email**: Send comprehensive quote package
- **Currency Support**: Multi-currency quotes (USD, EUR, GBP, CAD)
- **Location**: `src/components/quotes/steps/FinalizeAndSend.tsx`

### 2. Dashboard & Overview

**Dashboard Components**:
- **Lead Tracker**: Manage sales leads with status (New, Contacted, Qualified, Lost)
- **Task Manager**: To-do list for sales activities with priority levels
- **Notification Center**: System notifications, quote follow-ups, stock alerts
- **Magic Quote Chat**: AI assistant for quick quote questions
- **Quick Stats**: Revenue, quotes sent, conversion rate, avg deal size

**Locations**:
- `src/components/dashboard/DashboardOverview.tsx`
- `src/components/dashboard/LeadTracker.tsx`
- `src/components/dashboard/TaskManager.tsx`
- `src/components/dashboard/NotificationCenter.tsx`

### 3. Analytics & Reporting

**Conversion Tracking**:
- Track quote creation flow
- Monitor step completion rates
- Identify drop-off points
- Session-based analytics

**Satisfaction Surveys**:
- Post-quote satisfaction ratings
- Feedback collection
- Quick trigger buttons

**Dashboard Metrics**:
- Quote conversion rates
- Average deal size
- Time-to-quote metrics
- Department performance

**Locations**:
- `src/components/analytics/AnalyticsDashboard.tsx`
- `src/components/analytics/ConversionTracker.tsx`
- `src/contexts/AnalyticsContext.tsx`

### 4. Department Management

**Multi-Department Support**:
- Nutraceuticals
- Cosmetics
- Food & Beverage
- Pharma

**Department-Specific Features**:
- Separate product catalogs
- Department-specific customers
- Custom pricing rules
- Department-aware routing

**Location**: 
- `src/contexts/DepartmentContext.tsx`
- `src/components/layout/DepartmentSelector.tsx`

### 5. Customer Management

**Customer Data Structure**:
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  billingAddress: Address;
  shippingAddress: Address;
  creditStatus: "excellent" | "good" | "fair" | "poor";
  paymentTerms: string;
  outstandingBalance: number;
  creditLimit: number;
  accountManager: string;
  netsuiteId: string;
  departments: string[];
  // ... snapshot data
}
```

**Customer Features**:
- Search and filter
- Credit status indicators
- NetSuite integration
- Order history tracking
- Address management
- Payment terms

**Data Files**:
- `src/data/customers.json`
- `src/data/department-customers.json`

### 6. Product Management

**Product Data Structure**:
```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  endUses: string[];
  compliance: string[];
  description: string;
  batches: Batch[];
  department: string;
}

interface Batch {
  id: string;
  lotNumber: string;
  quantity: number;
  unitPrice: number;
  expirationDate: string;
  quality: string;
}
```

**Product Features**:
- End-use filtering
- Compliance filtering
- Batch-level inventory
- Department categorization
- Cross-sell recommendations

**Data Files**:
- `src/data/products.json`
- `src/data/department-products.json`

### 7. Order History & Sales Orders

**Sales Order Structure**:
```typescript
interface SalesOrder {
  id: string; // SO-YYYY-####
  customerId: string;
  customerName: string;
  createdDate: string;
  totalAmount: number;
  status: string;
  deliveryMethod: string;
  items: SalesOrderItem[];
}

interface SalesOrderItem {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

**Features**:
- Search orders by product name/SKU
- Filter by customer
- Historical pricing reference
- Order details display

**Data File**: `src/data/sales-orders.json`

## Data Model

### Entity Relationships

```
Customer (1) ----> (N) Quotes
Customer (1) ----> (N) SalesOrders
Quote (1) ----> (N) LineItems
LineItem (N) ----> (1) Product
Product (1) ----> (N) Batches
Customer (N) ----> (N) Departments
Product (N) ----> (N) Departments
```

### Key Data Files

1. **customers.json**: All customer records
2. **department-customers.json**: Department-specific customer assignments
3. **products.json**: Master product catalog
4. **department-products.json**: Department-specific products
5. **sales-orders.json**: Historical sales orders
6. **quotes.json**: Quote history
7. **leads.json**: Sales leads
8. **tasks.json**: Task list
9. **notifications.json**: System notifications
10. **departments.json**: Department configurations

## User Workflows

### Creating a Quote

1. Navigate to "Create Quote" from dashboard
2. **Select Customer**: Search and choose customer (or create new)
3. **Select Products**: 
   - Choose guided workflow (end-use → compliance → products)
   - OR use free search
   - Add batches to quote
   - Optional: bulk upload CSV
4. **Review Customer Details**: 
   - Verify addresses
   - Search customer order history
   - Choose shipping method
   - Add special instructions
5. **Configure Costs**: 
   - Review pricing
   - Apply CEO margin overrides if needed
   - Manual price adjustments
6. **Finalize**: 
   - Select payment method
   - Preview quote
   - Generate shareable link
   - Send via email

### Searching Customer Order History (NEW Feature)

1. During quote creation (Customer Details step)
2. Type product name or SKU in search box
3. View filtered results showing:
   - All orders containing that product
   - Order date, SO#, price, quantity
   - Customer name, delivery method
4. Use historical data to inform pricing decisions

## UI/UX Design System

### Color Scheme (HSL-based)

All colors use CSS custom properties defined in `src/index.css`:
- Primary colors: `--primary`, `--primary-foreground`
- Secondary colors: `--secondary`, `--secondary-foreground`
- Accent colors: `--accent`, `--accent-foreground`
- Status colors: `--destructive`, `--warning`, `--success`
- Neutral colors: `--background`, `--foreground`, `--muted`, `--border`

### Component Library

Shadcn/ui components (customizable):
- Buttons, Cards, Dialogs, Dropdowns
- Forms, Inputs, Selects, Textareas
- Tables, Tabs, Accordions
- Toasts, Alerts, Badges
- Progress indicators, Skeletons

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile
- Adaptive layouts for all views

## Integration Points

### NetSuite Integration

- Customer lookup via NetSuite ID
- Direct links to customer records
- Placeholder for future API integration

### Currency Support

- Multi-currency context
- Conversion rates (mock data)
- Currency selector in UI
- Format prices based on selected currency

### Analytics Integration

- Conversion tracking throughout quote flow
- Session-based event tracking
- Analytics context provider
- Future integration ready

## Demo Features

### Demo User Switcher

- Switch between different user personas
- Different department access
- Role-based feature access
- Testing different scenarios

**Location**: `src/components/demo/DemoUserSwitcher.tsx`

## State Management

### React Contexts

1. **DepartmentContext**: 
   - Current department selection
   - Department-specific data filtering
   - Department switching

2. **CurrencyContext**: 
   - Selected currency
   - Conversion rates
   - Price formatting

3. **AnalyticsContext**: 
   - Event tracking
   - Conversion funnel
   - Session management

## Recent Additions & Enhancements

### Customer Order History Search (Latest)
- Added product search in customer order history
- Positioned above customer snapshot in CustomerDetails step
- Real-time filtering of sales orders by product name/SKU
- Display of historical pricing and order details
- Fixed customer ID mapping in sales orders data

## Future Considerations

### Potential Enhancements
1. **Backend Integration**: 
   - Enable Lovable Cloud for persistent data
   - User authentication
   - Real-time updates

2. **Advanced Analytics**: 
   - More detailed reporting
   - Custom date ranges
   - Export capabilities

3. **Workflow Automation**: 
   - Auto-follow-ups
   - Quote expiration reminders
   - Inventory alerts

4. **Enhanced Search**: 
   - Elasticsearch integration
   - Fuzzy matching
   - Advanced filters

5. **Mobile App**: 
   - Native mobile experience
   - Offline support
   - Push notifications

## Development Guidelines

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow React best practices
- Utilize custom hooks for reusable logic

### Styling
- Use Tailwind utility classes
- Leverage design system tokens
- Avoid inline styles
- Maintain dark/light mode support

### Data Handling
- JSON files for mock data during development
- Type definitions match data structure
- Validate data shapes with TypeScript

### Performance
- Lazy loading for routes
- Memoization for expensive calculations
- Optimized re-renders with React.memo
- Efficient list rendering with keys

## Testing & Quality

### Current State
- Development with mock data
- Manual testing workflows
- Type safety via TypeScript

### Future Testing
- Unit tests for utilities
- Component tests with React Testing Library
- E2E tests with Playwright
- Integration tests for workflows

## Documentation

### For Developers
- Code comments for complex logic
- TypeScript interfaces for data structures
- Component props documentation
- README for setup instructions

### For Users
- In-app tooltips and help text
- Guided workflows for quote creation
- Demo data for exploration

## Conclusion

This quotation engine is a comprehensive, modern web application designed for B2B sales teams. It streamlines the quote creation process with intelligent product selection, customer management, and pricing tools. The architecture is scalable, maintainable, and ready for future enhancements including backend integration and advanced analytics.

The system successfully balances complexity with usability, providing powerful features while maintaining an intuitive user experience. Recent additions like the customer order history search demonstrate the system's evolution based on user needs.
