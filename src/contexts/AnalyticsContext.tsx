import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteMetrics {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  userId: string;
  customerId?: string;
  lineItemsCount?: number;
  totalValue?: number;
  convertedToOrder?: boolean;
  conversionDate?: number;
}

export interface UserProductivity {
  userId: string;
  quotesCreatedToday: number;
  quotesCreatedThisWeek: number;
  quotesCreatedThisMonth: number;
  averageQuoteTime: number;
  conversionRate: number;
}

export interface UserSatisfaction {
  id: string;
  userId: string;
  rating: number;
  feedback?: string;
  category: 'quote_creation' | 'overall_experience' | 'feature_request';
  timestamp: number;
}

export interface AnalyticsData {
  quotes: QuoteMetrics[];
  productivity: UserProductivity[];
  satisfaction: UserSatisfaction[];
  averageQuoteTime: number;
  overallConversionRate: number;
  totalQuotesToday: number;
  averageSatisfactionScore: number;
}

interface AnalyticsContextType {
  analytics: AnalyticsData;
  startQuoteTracking: (userId: string) => string;
  completeQuoteTracking: (quoteId: string, customerId?: string, lineItemsCount?: number, totalValue?: number) => void;
  abandonQuoteTracking: (quoteId: string) => void;
  markQuoteConverted: (quoteId: string) => void;
  submitSatisfactionScore: (userId: string, rating: number, feedback?: string, category?: string) => void;
  getProductivityMetrics: (userId: string) => UserProductivity | undefined;
  refreshAnalytics: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    quotes: [],
    productivity: [],
    satisfaction: [],
    averageQuoteTime: 0,
    overallConversionRate: 0,
    totalQuotesToday: 0,
    averageSatisfactionScore: 0,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('quotehub_analytics');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAnalytics(parsed);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever analytics changes
  useEffect(() => {
    localStorage.setItem('quotehub_analytics', JSON.stringify(analytics));
  }, [analytics]);

  const startQuoteTracking = (userId: string): string => {
    const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newQuote: QuoteMetrics = {
      id: quoteId,
      startTime: Date.now(),
      status: 'in_progress',
      userId,
    };

    setAnalytics(prev => ({
      ...prev,
      quotes: [...prev.quotes, newQuote],
    }));

    return quoteId;
  };

  const completeQuoteTracking = (
    quoteId: string, 
    customerId?: string, 
    lineItemsCount?: number, 
    totalValue?: number
  ) => {
    setAnalytics(prev => {
      const updatedQuotes = prev.quotes.map(quote => {
        if (quote.id === quoteId) {
          const endTime = Date.now();
          return {
            ...quote,
            endTime,
            duration: endTime - quote.startTime,
            status: 'completed' as const,
            customerId,
            lineItemsCount,
            totalValue,
          };
        }
        return quote;
      });

      return {
        ...prev,
        quotes: updatedQuotes,
      };
    });
  };

  const abandonQuoteTracking = (quoteId: string) => {
    setAnalytics(prev => ({
      ...prev,
      quotes: prev.quotes.map(quote =>
        quote.id === quoteId
          ? { ...quote, status: 'abandoned' as const, endTime: Date.now() }
          : quote
      ),
    }));
  };

  const markQuoteConverted = (quoteId: string) => {
    setAnalytics(prev => ({
      ...prev,
      quotes: prev.quotes.map(quote =>
        quote.id === quoteId
          ? { ...quote, convertedToOrder: true, conversionDate: Date.now() }
          : quote
      ),
    }));
  };

  const submitSatisfactionScore = (
    userId: string, 
    rating: number, 
    feedback?: string, 
    category: string = 'overall_experience'
  ) => {
    const satisfactionEntry: UserSatisfaction = {
      id: `satisfaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      rating,
      feedback,
      category: category as any,
      timestamp: Date.now(),
    };

    setAnalytics(prev => ({
      ...prev,
      satisfaction: [...prev.satisfaction, satisfactionEntry],
    }));
  };

  const getProductivityMetrics = (userId: string): UserProductivity | undefined => {
    const now = Date.now();
    const today = new Date(now).setHours(0, 0, 0, 0);
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const userQuotes = analytics.quotes.filter(q => q.userId === userId && q.status === 'completed');
    
    const quotesToday = userQuotes.filter(q => q.endTime && q.endTime >= today).length;
    const quotesThisWeek = userQuotes.filter(q => q.endTime && q.endTime >= weekAgo).length;
    const quotesThisMonth = userQuotes.filter(q => q.endTime && q.endTime >= monthAgo).length;
    
    const completedQuotes = userQuotes.filter(q => q.duration);
    const averageTime = completedQuotes.length > 0
      ? completedQuotes.reduce((sum, q) => sum + (q.duration || 0), 0) / completedQuotes.length
      : 0;

    const convertedQuotes = userQuotes.filter(q => q.convertedToOrder).length;
    const conversionRate = userQuotes.length > 0 ? (convertedQuotes / userQuotes.length) * 100 : 0;

    return {
      userId,
      quotesCreatedToday: quotesToday,
      quotesCreatedThisWeek: quotesThisWeek,
      quotesCreatedThisMonth: quotesThisMonth,
      averageQuoteTime: averageTime,
      conversionRate,
    };
  };

  const refreshAnalytics = () => {
    const completedQuotes = analytics.quotes.filter(q => q.status === 'completed' && q.duration);
    const averageQuoteTime = completedQuotes.length > 0
      ? completedQuotes.reduce((sum, q) => sum + (q.duration || 0), 0) / completedQuotes.length
      : 0;

    const totalQuotes = analytics.quotes.filter(q => q.status === 'completed').length;
    const convertedQuotes = analytics.quotes.filter(q => q.convertedToOrder).length;
    const overallConversionRate = totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0;

    const today = new Date().setHours(0, 0, 0, 0);
    const totalQuotesToday = analytics.quotes.filter(q => 
      q.status === 'completed' && q.endTime && q.endTime >= today
    ).length;

    const satisfactionScores = analytics.satisfaction.map(s => s.rating);
    const averageSatisfactionScore = satisfactionScores.length > 0
      ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length
      : 0;

    setAnalytics(prev => ({
      ...prev,
      averageQuoteTime,
      overallConversionRate,
      totalQuotesToday,
      averageSatisfactionScore,
    }));
  };

  // Refresh analytics whenever data changes
  useEffect(() => {
    refreshAnalytics();
  }, [analytics.quotes, analytics.satisfaction]);

  const value: AnalyticsContextType = {
    analytics,
    startQuoteTracking,
    completeQuoteTracking,
    abandonQuoteTracking,
    markQuoteConverted,
    submitSatisfactionScore,
    getProductivityMetrics,
    refreshAnalytics,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}