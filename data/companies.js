// Define companies data
const companies = [
    {
        id: "TCS",
        name: "Tata Consultancy Services Ltd",
        sector: "IT Services",
        marketCap: 1193571,
        currentPrice: 3299,
        high52: 4592,
        low52: 3056,
        pe: 24.6,
        bookValue: 262,
        dividendYield: 1.67,
        roce: 45.2,
        roe: 42.8,
        faceValue: 1,
        industry: "IT Services & Consulting",
        description: "Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is a subsidiary of the Tata Group and operates in 149 locations across 46 countries.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 225538 },
                { year: "Mar 2022", value: 191754 },
                { year: "Mar 2021", value: 164177 },
                { year: "Mar 2020", value: 156949 },
                { year: "Mar 2019", value: 146463 }
            ],
            profit: [
                { year: "Mar 2023", value: 42147 },
                { year: "Mar 2022", value: 38327 },
                { year: "Mar 2021", value: 32430 },
                { year: "Mar 2020", value: 32340 },
                { year: "Mar 2019", value: 31472 }
            ],
            equity: [
                { year: "Mar 2023", value: 99805 },
                { year: "Mar 2022", value: 90956 },
                { year: "Mar 2021", value: 84126 },
                { year: "Mar 2020", value: 84126 },
                { year: "Mar 2019", value: 78541 }
            ]
        }
    },
    {
        id: "RELIANCE",
        name: "Reliance Industries Ltd",
        sector: "Oil & Gas",
        marketCap: 1587000,
        currentPrice: 2345,
        high52: 2856,
        low52: 2140,
        pe: 28.5,
        bookValue: 1087,
        dividendYield: 0.34,
        roce: 11.2,
        roe: 9.5,
        faceValue: 10,
        industry: "Refineries / Petro-Products",
        description: "Reliance Industries Limited is an Indian multinational conglomerate company, headquartered in Mumbai. RIL's diverse businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 792756 },
                { year: "Mar 2022", value: 678737 },
                { year: "Mar 2021", value: 486326 },
                { year: "Mar 2020", value: 612437 },
                { year: "Mar 2019", value: 583280 }
            ],
            profit: [
                { year: "Mar 2023", value: 66702 },
                { year: "Mar 2022", value: 60705 },
                { year: "Mar 2021", value: 49128 },
                { year: "Mar 2020", value: 39880 },
                { year: "Mar 2019", value: 39588 }
            ],
            equity: [
                { year: "Mar 2023", value: 599819 },
                { year: "Mar 2022", value: 549999 },
                { year: "Mar 2021", value: 498784 },
                { year: "Mar 2020", value: 439377 },
                { year: "Mar 2019", value: 387112 }
            ]
        }
    },
    {
        id: "HDFCBANK",
        name: "HDFC Bank Ltd",
        sector: "Banking",
        marketCap: 1245000,
        currentPrice: 1678,
        high52: 1757,
        low52: 1363,
        pe: 22.1,
        bookValue: 532,
        dividendYield: 0.89,
        roce: 10.8,
        roe: 16.9,
        faceValue: 1,
        industry: "Banks - Private Sector",
        description: "HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India's largest private sector bank by assets and the world's 10th largest bank by market capitalisation as of April 2021.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 174686 },
                { year: "Mar 2022", value: 157263 },
                { year: "Mar 2021", value: 146063 },
                { year: "Mar 2020", value: 138073 },
                { year: "Mar 2019", value: 118894 }
            ],
            profit: [
                { year: "Mar 2023", value: 44108 },
                { year: "Mar 2022", value: 36961 },
                { year: "Mar 2021", value: 31116 },
                { year: "Mar 2020", value: 26257 },
                { year: "Mar 2019", value: 21078 }
            ],
            equity: [
                { year: "Mar 2023", value: 264436 },
                { year: "Mar 2022", value: 229304 },
                { year: "Mar 2021", value: 200796 },
                { year: "Mar 2020", value: 174436 },
                { year: "Mar 2019", value: 150982 }
            ]
        }
    },
    {
        id: "INFY",
        name: "Infosys Ltd",
        sector: "IT Services",
        marketCap: 625000,
        currentPrice: 1510,
        high52: 1620,
        low52: 1215,
        pe: 27.8,
        bookValue: 235,
        dividendYield: 2.12,
        roce: 36.5,
        roe: 31.2,
        faceValue: 5,
        industry: "IT Services & Consulting",
        description: "Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services. The company is headquartered in Bangalore.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 146767 },
                { year: "Mar 2022", value: 121641 },
                { year: "Mar 2021", value: 100472 },
                { year: "Mar 2020", value: 90791 },
                { year: "Mar 2019", value: 82675 }
            ],
            profit: [
                { year: "Mar 2023", value: 24108 },
                { year: "Mar 2022", value: 22110 },
                { year: "Mar 2021", value: 19351 },
                { year: "Mar 2020", value: 16594 },
                { year: "Mar 2019", value: 15404 }
            ],
            equity: [
                { year: "Mar 2023", value: 79594 },
                { year: "Mar 2022", value: 76351 },
                { year: "Mar 2021", value: 74227 },
                { year: "Mar 2020", value: 65450 },
                { year: "Mar 2019", value: 64948 }
            ]
        }
    },
    {
        id: "HINDUNILVR",
        name: "Hindustan Unilever Ltd",
        sector: "FMCG",
        marketCap: 587000,
        currentPrice: 2498,
        high52: 2768,
        low52: 2393,
        pe: 69.2,
        bookValue: 236,
        dividendYield: 1.32,
        roce: 42.7,
        roe: 36.5,
        faceValue: 1,
        industry: "Personal Care",
        description: "Hindustan Unilever Limited is an Indian consumer goods company headquartered in Mumbai. It is a subsidiary of the British company Unilever. HUL's products include foods, beverages, cleaning agents, personal care products, water purifiers and other fast-moving consumer goods.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 59144 },
                { year: "Mar 2022", value: 51468 },
                { year: "Mar 2021", value: 47028 },
                { year: "Mar 2020", value: 39518 },
                { year: "Mar 2019", value: 38224 }
            ],
            profit: [
                { year: "Mar 2023", value: 9964 },
                { year: "Mar 2022", value: 8879 },
                { year: "Mar 2021", value: 7954 },
                { year: "Mar 2020", value: 6738 },
                { year: "Mar 2019", value: 6036 }
            ],
            equity: [
                { year: "Mar 2023", value: 11236 },
                { year: "Mar 2022", value: 9460 },
                { year: "Mar 2021", value: 8768 },
                { year: "Mar 2020", value: 7726 },
                { year: "Mar 2019", value: 7589 }
            ]
        }
    },
    {
        id: "TATAMOTORS",
        name: "Tata Motors Ltd",
        sector: "Automobiles",
        marketCap: 275000,
        currentPrice: 825,
        high52: 949,
        low52: 630,
        pe: 12.5,
        bookValue: 146,
        dividendYield: 0.24,
        roce: 15.8,
        roe: 14.2,
        faceValue: 2,
        industry: "Automobiles - 4 Wheelers",
        description: "Tata Motors Limited is an Indian multinational automotive manufacturing company headquartered in Mumbai, India and a subsidiary of the Tata Group. The company produces passenger cars, trucks, vans, coaches, buses, luxury cars, sports cars, and construction equipment.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 349755 },
                { year: "Mar 2022", value: 278454 },
                { year: "Mar 2021", value: 249795 },
                { year: "Mar 2020", value: 258594 },
                { year: "Mar 2019", value: 301938 }
            ],
            profit: [
                { year: "Mar 2023", value: 2414 },
                { year: "Mar 2022", value: -11441 },
                { year: "Mar 2021", value: -13395 },
                { year: "Mar 2020", value: -11975 },
                { year: "Mar 2019", value: -28724 }
            ],
            equity: [
                { year: "Mar 2023", value: 56351 },
                { year: "Mar 2022", value: 44561 },
                { year: "Mar 2021", value: 55247 },
                { year: "Mar 2020", value: 63892 },
                { year: "Mar 2019", value: 60585 }
            ]
        }
    },
    {
        id: "BHARTIARTL",
        name: "Bharti Airtel Ltd",
        sector: "Telecom",
        marketCap: 565000,
        currentPrice: 1050,
        high52: 1200,
        low52: 895,
        pe: 76.3,
        bookValue: 195,
        dividendYield: 0.29,
        roce: 9.8,
        roe: 8.5,
        faceValue: 5,
        industry: "Telecommunications - Service Provider",
        description: "Bharti Airtel Limited is an Indian multinational telecommunications services company headquartered in New Delhi, India. It operates in 18 countries across South Asia and Africa, as well as the Channel Islands.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 139144 },
                { year: "Mar 2022", value: 116547 },
                { year: "Mar 2021", value: 100616 },
                { year: "Mar 2020", value: 87539 },
                { year: "Mar 2019", value: 80780 }
            ],
            profit: [
                { year: "Mar 2023", value: 8305 },
                { year: "Mar 2022", value: -3832 },
                { year: "Mar 2021", value: -15084 },
                { year: "Mar 2020", value: -3271 },
                { year: "Mar 2019", value: 409 }
            ],
            equity: [
                { year: "Mar 2023", value: 193524 },
                { year: "Mar 2022", value: 187463 },
                { year: "Mar 2021", value: 183386 },
                { year: "Mar 2020", value: 151271 },
                { year: "Mar 2019", value: 151894 }
            ]
        }
    },
    {
        id: "ASIANPAINT",
        name: "Asian Paints Ltd",
        sector: "Paints",
        marketCap: 325000,
        currentPrice: 3390,
        high52: 3590,
        low52: 2685,
        pe: 80.7,
        bookValue: 158,
        dividendYield: 0.53,
        roce: 34.2,
        roe: 29.8,
        faceValue: 1,
        industry: "Paints",
        description: "Asian Paints Limited is an Indian multinational paint company headquartered in Mumbai, Maharashtra. The company manufactures, sells and distributes paints, coatings, products related to home decor, bath fittings, and provides related services.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 34489 },
                { year: "Mar 2022", value: 29101 },
                { year: "Mar 2021", value: 21713 },
                { year: "Mar 2020", value: 20211 },
                { year: "Mar 2019", value: 19248 }
            ],
            profit: [
                { year: "Mar 2023", value: 4552 },
                { year: "Mar 2022", value: 3868 },
                { year: "Mar 2021", value: 3139 },
                { year: "Mar 2020", value: 2776 },
                { year: "Mar 2019", value: 2448 }
            ],
            equity: [
                { year: "Mar 2023", value: 15187 },
                { year: "Mar 2022", value: 13588 },
                { year: "Mar 2021", value: 11816 },
                { year: "Mar 2020", value: 9704 },
                { year: "Mar 2019", value: 8907 }
            ]
        }
    },
    {
        id: "AXISBANK",
        name: "Axis Bank Ltd",
        sector: "Banking",
        marketCap: 325000,
        currentPrice: 1056,
        high52: 1151,
        low52: 875,
        pe: 16.8,
        bookValue: 412,
        dividendYield: 0.19,
        roce: 8.5,
        roe: 15.2,
        faceValue: 2,
        industry: "Banks - Private Sector",
        description: "Axis Bank Limited is an Indian banking and financial services company headquartered in Mumbai, Maharashtra. It sells financial services to large and mid-size companies, SMEs and retail businesses.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 91626 },
                { year: "Mar 2022", value: 82597 },
                { year: "Mar 2021", value: 80329 },
                { year: "Mar 2020", value: 73342 },
                { year: "Mar 2019", value: 63305 }
            ],
            profit: [
                { year: "Mar 2023", value: 15901 },
                { year: "Mar 2022", value: 13025 },
                { year: "Mar 2021", value: 6588 },
                { year: "Mar 2020", value: 1627 },
                { year: "Mar 2019", value: 4677 }
            ],
            equity: [
                { year: "Mar 2023", value: 126261 },
                { year: "Mar 2022", value: 110506 },
                { year: "Mar 2021", value: 99277 },
                { year: "Mar 2020", value: 84948 },
                { year: "Mar 2019", value: 67634 }
            ]
        }
    },
    {
        id: "ICICIBANK",
        name: "ICICI Bank Ltd",
        sector: "Banking",
        marketCap: 725000,
        currentPrice: 1038,
        high52: 1123,
        low52: 845,
        pe: 21.5,
        bookValue: 256,
        dividendYield: 0.96,
        roce: 9.2,
        roe: 16.8,
        faceValue: 2,
        industry: "Banks - Private Sector",
        description: "ICICI Bank Limited is an Indian multinational banking and financial services company headquartered in Mumbai, Maharashtra with its registered office in Vadodara, Gujarat. It offers a wide range of banking products and financial services for corporate and retail customers.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 127939 },
                { year: "Mar 2022", value: 110188 },
                { year: "Mar 2021", value: 98086 },
                { year: "Mar 2020", value: 91246 },
                { year: "Mar 2019", value: 77913 }
            ],
            profit: [
                { year: "Mar 2023", value: 31896 },
                { year: "Mar 2022", value: 23339 },
                { year: "Mar 2021", value: 16193 },
                { year: "Mar 2020", value: 7931 },
                { year: "Mar 2019", value: 3363 }
            ],
            equity: [
                { year: "Mar 2023", value: 177811 },
                { year: "Mar 2022", value: 154139 },
                { year: "Mar 2021", value: 137632 },
                { year: "Mar 2020", value: 124379 },
                { year: "Mar 2019", value: 109672 }
            ]
        }
    },
    {
        id: "HDFC",
        name: "Housing Development Finance Corporation Ltd",
        sector: "Financial Services",
        marketCap: 890000,
        currentPrice: 2780,
        high52: 2910,
        low52: 2425,
        pe: 19.8,
        bookValue: 635,
        dividendYield: 1.15,
        roce: 13.2,
        roe: 14.5,
        faceValue: 2,
        industry: "Housing Finance",
        description: "Housing Development Finance Corporation Limited is an Indian financial services company based in Mumbai. It is a major housing finance provider in India. The company was merged with HDFC Bank on July 1, 2023, creating one of India's largest banks.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 135628 },
                { year: "Mar 2022", value: 116599 },
                { year: "Mar 2021", value: 113249 },
                { year: "Mar 2020", value: 111436 },
                { year: "Mar 2019", value: 96194 }
            ],
            profit: [
                { year: "Mar 2023", value: 17160 },
                { year: "Mar 2022", value: 13742 },
                { year: "Mar 2021", value: 12027 },
                { year: "Mar 2020", value: 17769 },
                { year: "Mar 2019", value: 9632 }
            ],
            equity: [
                { year: "Mar 2023", value: 115400 },
                { year: "Mar 2022", value: 104051 },
                { year: "Mar 2021", value: 95834 },
                { year: "Mar 2020", value: 85811 },
                { year: "Mar 2019", value: 77355 }
            ]
        }
    },
    {
        id: "HDFCLIFE",
        name: "HDFC Life Insurance Company Ltd",
        sector: "Financial Services",
        marketCap: 145000,
        currentPrice: 675,
        high52: 710,
        low52: 510,
        pe: 85.4,
        bookValue: 78.5,
        dividendYield: 0.37,
        roce: 11.5,
        roe: 12.8,
        faceValue: 10,
        industry: "Life & Health Insurance",
        description: "HDFC Life Insurance Company Limited is a long-term life insurance provider with its headquarters in Mumbai, offering individual and group insurance. It is a joint venture between HDFC Ltd. and Standard Life Aberdeen.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 52889 },
                { year: "Mar 2022", value: 45780 },
                { year: "Mar 2021", value: 38583 },
                { year: "Mar 2020", value: 32212 },
                { year: "Mar 2019", value: 29186 }
            ],
            profit: [
                { year: "Mar 2023", value: 1360 },
                { year: "Mar 2022", value: 1208 },
                { year: "Mar 2021", value: 1360 },
                { year: "Mar 2020", value: 1295 },
                { year: "Mar 2019", value: 1257 }
            ],
            equity: [
                { year: "Mar 2023", value: 10635 },
                { year: "Mar 2022", value: 9519 },
                { year: "Mar 2021", value: 8568 },
                { year: "Mar 2020", value: 7424 },
                { year: "Mar 2019", value: 6451 }
            ]
        }
    },
    {
        id: "HDFCAMC",
        name: "HDFC Asset Management Company Ltd",
        sector: "Financial Services",
        marketCap: 78000,
        currentPrice: 3650,
        high52: 3950,
        low52: 2850,
        pe: 42.3,
        bookValue: 189,
        dividendYield: 1.92,
        roce: 32.5,
        roe: 28.7,
        faceValue: 5,
        industry: "Asset Management",
        description: "HDFC Asset Management Company Limited is one of the largest mutual fund management companies in India. The company manages a range of mutual fund schemes across equity, debt, and other asset classes.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 2433 },
                { year: "Mar 2022", value: 2433 },
                { year: "Mar 2021", value: 2201 },
                { year: "Mar 2020", value: 2003 },
                { year: "Mar 2019", value: 2096 }
            ],
            profit: [
                { year: "Mar 2023", value: 1515 },
                { year: "Mar 2022", value: 1393 },
                { year: "Mar 2021", value: 1326 },
                { year: "Mar 2020", value: 1262 },
                { year: "Mar 2019", value: 931 }
            ],
            equity: [
                { year: "Mar 2023", value: 5278 },
                { year: "Mar 2022", value: 4815 },
                { year: "Mar 2021", value: 4415 },
                { year: "Mar 2020", value: 3918 },
                { year: "Mar 2019", value: 3434 }
            ]
        }
    },
    {
        id: "BAJFINANCE",
        name: "Bajaj Finance Ltd",
        sector: "Financial Services",
        marketCap: 450000,
        currentPrice: 7450,
        high52: 8190,
        low52: 5485,
        pe: 38.2,
        bookValue: 1120,
        dividendYield: 0.13,
        roce: 9.8,
        roe: 20.5,
        faceValue: 2,
        industry: "NBFC",
        description: "Bajaj Finance Limited is an Indian Non-Banking Financial Company (NBFC) which is a subsidiary of Bajaj Finserv. It provides various financial services including consumer finance, SME finance, commercial lending, wealth management, and more.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 41308 },
                { year: "Mar 2022", value: 31640 },
                { year: "Mar 2021", value: 26683 },
                { year: "Mar 2020", value: 26385 },
                { year: "Mar 2019", value: 18502 }
            ],
            profit: [
                { year: "Mar 2023", value: 11808 },
                { year: "Mar 2022", value: 7028 },
                { year: "Mar 2021", value: 4420 },
                { year: "Mar 2020", value: 5264 },
                { year: "Mar 2019", value: 3995 }
            ],
            equity: [
                { year: "Mar 2023", value: 68941 },
                { year: "Mar 2022", value: 57385 },
                { year: "Mar 2021", value: 41681 },
                { year: "Mar 2020", value: 37143 },
                { year: "Mar 2019", value: 19408 }
            ]
        }
    },
    {
        id: "KOTAKBANK",
        name: "Kotak Mahindra Bank Ltd",
        sector: "Banking",
        marketCap: 380000,
        currentPrice: 1915,
        high52: 2063,
        low52: 1644,
        pe: 25.6,
        bookValue: 478,
        dividendYield: 0.05,
        roce: 10.2,
        roe: 13.5,
        faceValue: 5,
        industry: "Banks - Private Sector",
        description: "Kotak Mahindra Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It offers banking products and financial services for corporate and retail customers in the areas of personal finance, investment banking, life insurance, and wealth management.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 71250 },
                { year: "Mar 2022", value: 59153 },
                { year: "Mar 2021", value: 54947 },
                { year: "Mar 2020", value: 50365 },
                { year: "Mar 2019", value: 39358 }
            ],
            profit: [
                { year: "Mar 2023", value: 14925 },
                { year: "Mar 2022", value: 12089 },
                { year: "Mar 2021", value: 9990 },
                { year: "Mar 2020", value: 8593 },
                { year: "Mar 2019", value: 7204 }
            ],
            equity: [
                { year: "Mar 2023", value: 95022 },
                { year: "Mar 2022", value: 83279 },
                { year: "Mar 2021", value: 74207 },
                { year: "Mar 2020", value: 67134 },
                { year: "Mar 2019", value: 58280 }
            ]
        }
    },
    {
        id: "SBIN",
        name: "State Bank of India",
        sector: "Banking",
        marketCap: 625000,
        currentPrice: 700,
        high52: 743,
        low52: 570,
        pe: 9.8,
        bookValue: 342,
        dividendYield: 0.86,
        roce: 8.5,
        roe: 16.2,
        faceValue: 1,
        industry: "Banks - Public Sector",
        description: "State Bank of India is an Indian multinational, public sector banking and financial services statutory body headquartered in Mumbai. SBI is the largest bank in India with a 23% market share by assets and a 25% share of the total loan and deposits market.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 359670 },
                { year: "Mar 2022", value: 305783 },
                { year: "Mar 2021", value: 308647 },
                { year: "Mar 2020", value: 302545 },
                { year: "Mar 2019", value: 279644 }
            ],
            profit: [
                { year: "Mar 2023", value: 50232 },
                { year: "Mar 2022", value: 31676 },
                { year: "Mar 2021", value: 20410 },
                { year: "Mar 2020", value: 14488 },
                { year: "Mar 2019", value: 862 }
            ],
            equity: [
                { year: "Mar 2023", value: 316992 },
                { year: "Mar 2022", value: 279276 },
                { year: "Mar 2021", value: 252982 },
                { year: "Mar 2020", value: 232162 },
                { year: "Mar 2019", value: 220021 }
            ]
        }
    },
    {
        id: "WIPRO",
        name: "Wipro Ltd",
        sector: "IT Services",
        marketCap: 225000,
        currentPrice: 410,
        high52: 443,
        low52: 352,
        pe: 18.5,
        bookValue: 145,
        dividendYield: 1.46,
        roce: 16.8,
        roe: 15.2,
        faceValue: 2,
        industry: "IT Services & Consulting",
        description: "Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services. Headquartered in Bangalore, Karnataka, India, Wipro is one of the largest IT services companies globally.",
        financials: {
            revenue: [
                { year: "Mar 2023", value: 86409 },
                { year: "Mar 2022", value: 79747 },
                { year: "Mar 2021", value: 61943 },
                { year: "Mar 2020", value: 61023 },
                { year: "Mar 2019", value: 58584 }
            ],
            profit: [
                { year: "Mar 2023", value: 11350 },
                { year: "Mar 2022", value: 12219 },
                { year: "Mar 2021", value: 10796 },
                { year: "Mar 2020", value: 9722 },
                { year: "Mar 2019", value: 9000 }
            ],
            equity: [
                { year: "Mar 2023", value: 79454 },
                { year: "Mar 2022", value: 74090 },
                { year: "Mar 2021", value: 74877 },
                { year: "Mar 2020", value: 66525 },
                { year: "Mar 2019", value: 63072 }
            ]
        }
    }
];

// Make companies data globally available
if (typeof window !== 'undefined') {
    window.companies = companies;
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { companies };
}
