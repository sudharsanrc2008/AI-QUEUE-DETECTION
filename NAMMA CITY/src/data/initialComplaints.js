export const initialComplaints = [
  {
    id: "NCC-2026-00125",
    category: "garbage",
    title: "Garbage Accumulation",
    description: "Huge pile of municipal waste overflowing from bins near 2nd Avenue junction. Stray dogs and cows scattering debris onto the carriageway.",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    resolutionImage: null,
    address: "2nd Avenue, Near Shanthi Colony, Anna Nagar, Chennai - 600040",
    lat: 13.0850,
    lng: 80.2101,
    severity: "high",
    priority: "high",
    aiConfidence: 91,
    department: "waste_management",
    status: "in_progress",
    reportedDate: "2026-09-08T09:30:00Z",
    expectedResolutionDate: "2026-09-11T18:00:00Z",
    resolvedDate: null,
    assignedOfficer: "R. Shanmugam (Ward 102 Inspector)",
    upvotes: 47,
    hasUserUpvoted: false,
    verifiedByCitizen: false,
    sensitiveArea: {
      nearSchool: true,
      nearHospital: false,
      mainRoad: true,
      publicSafety: false
    },
    timeline: [
      {
        status: "reported",
        title: "Complaint Registered",
        description: "Citizen reported issue with geo-tagged photo. AI classified as Garbage Accumulation (91% confidence).",
        timestamp: "2026-09-08T09:30:00Z",
        actor: "Citizen Portal"
      },
      {
        status: "verified",
        title: "Inspected by Ward Officer",
        description: "Grievance validated by Ward 102 Assistant Engineer.",
        timestamp: "2026-09-08T11:45:00Z",
        actor: "Ward 102 AE"
      },
      {
        status: "assigned",
        title: "Routed to Waste Management",
        description: "Dispatched to Zone 8 Solid Waste Conservancy Team.",
        timestamp: "2026-09-08T14:20:00Z",
        actor: "Central Redressal Cell"
      },
      {
        status: "in_progress",
        title: "Compactor Truck Dispatched",
        description: "Heavy compactor vehicle assigned. Clearance and bleaching powder sanitization underway.",
        timestamp: "2026-09-09T08:15:00Z",
        actor: "Sanitary Inspector"
      }
    ],
    comments: [
      {
        id: "c1",
        author: "Karthik R.",
        role: "Citizen",
        text: "The smell is very strong in the morning when school buses pass by. Please clear urgently.",
        timestamp: "2026-09-08T10:15:00Z"
      },
      {
        id: "c2",
        author: "Ward 102 Office",
        role: "Official",
        text: "Conservancy supervisor visited spot. Dedicated compactor scheduled for 9 AM clearance.",
        timestamp: "2026-09-08T16:00:00Z"
      }
    ]
  },
  {
    id: "NCC-2026-00124",
    category: "pothole",
    title: "Dangerous Pothole on LB Road",
    description: "Deep pothole created after recent pipeline work. Sharp edges causing motorcycle skids during nighttime.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    resolutionImage: null,
    address: "Lattice Bridge Road, Adyar, Chennai - 600020",
    lat: 13.0012,
    lng: 80.2565,
    severity: "medium",
    priority: "medium",
    aiConfidence: 94,
    department: "roads_highways",
    status: "verified",
    reportedDate: "2026-09-09T08:00:00Z",
    expectedResolutionDate: "2026-09-12T17:00:00Z",
    resolvedDate: null,
    assignedOfficer: "S. Murugan (Divisional Roads Engineer)",
    upvotes: 28,
    hasUserUpvoted: false,
    verifiedByCitizen: false,
    sensitiveArea: {
      nearSchool: false,
      nearHospital: false,
      mainRoad: true,
      publicSafety: true
    },
    timeline: [
      {
        status: "reported",
        title: "Complaint Registered",
        description: "Pothole logged with GPS coordinates.",
        timestamp: "2026-09-09T08:00:00Z",
        actor: "Citizen Portal"
      },
      {
        status: "verified",
        title: "Field Verified",
        description: "Dimensions measured (~1.2m diameter, 12cm depth). Work order queued for cold-mix bitumen patching.",
        timestamp: "2026-09-09T14:30:00Z",
        actor: "Roads Inspector"
      }
    ],
    comments: [
      {
        id: "c3",
        author: "Adyar Resident Association",
        role: "Citizen",
        text: "Two bikers almost slipped yesterday evening in the rain.",
        timestamp: "2026-09-09T09:10:00Z"
      }
    ]
  },
  {
    id: "NCC-2026-00123",
    category: "streetlight",
    title: "Streetlight Outage on 100ft Road",
    description: "Entire row of 4 LED streetlights not functioning for the past 3 days. Complete dark patch near junction.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    resolutionImage: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=800&q=80",
    address: "100 Feet Bypass Road, Velachery, Chennai - 600042",
    lat: 12.9815,
    lng: 80.2180,
    severity: "low",
    priority: "low",
    aiConfidence: 88,
    department: "electricity",
    status: "resolved",
    reportedDate: "2026-09-06T19:20:00Z",
    expectedResolutionDate: "2026-09-08T18:00:00Z",
    resolvedDate: "2026-09-08T16:45:00Z",
    assignedOfficer: "M. Kumar (TANGEDCO AE)",
    upvotes: 19,
    hasUserUpvoted: true,
    verifiedByCitizen: true,
    sensitiveArea: {
      nearSchool: false,
      nearHospital: false,
      mainRoad: false,
      publicSafety: false
    },
    timeline: [
      {
        status: "reported",
        title: "Complaint Registered",
        description: "Logged by citizen via web portal.",
        timestamp: "2026-09-06T19:20:00Z",
        actor: "Citizen Portal"
      },
      {
        status: "verified",
        title: "Verified by Electrical Wing",
        description: "Timer circuit fault diagnosed at distribution junction box.",
        timestamp: "2026-09-07T10:00:00Z",
        actor: "Electrical Supervisor"
      },
      {
        status: "assigned",
        title: "Work Order Issued",
        description: "Assigned to Lineman Team 4.",
        timestamp: "2026-09-07T13:00:00Z",
        actor: "TANGEDCO"
      },
      {
        status: "in_progress",
        title: "Cable & Relay Replacement",
        description: "Hydraulic ladder vehicle on site replacing faulty driver unit.",
        timestamp: "2026-09-08T14:30:00Z",
        actor: "Field Crew"
      },
      {
        status: "resolved",
        title: "Completed & Tested",
        description: "All 4 streetlights restored to full luminescence. Photo proof uploaded.",
        timestamp: "2026-09-08T16:45:00Z",
        actor: "AE Electrical"
      }
    ],
    comments: [
      {
        id: "c4",
        author: "Priya S.",
        role: "Citizen",
        text: "Thank you for the prompt repair! Lights are working bright now.",
        timestamp: "2026-09-08T19:00:00Z"
      }
    ]
  },
  {
    id: "NCC-2026-00122",
    category: "water_leakage",
    title: "Potable Water Pipeline Burst",
    description: "Underground Metro Water main line ruptured. Clean drinking water flooding street and entering shops.",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    resolutionImage: null,
    address: "North Usman Road, T. Nagar, Chennai - 600017",
    lat: 13.0418,
    lng: 80.2341,
    severity: "emergency",
    priority: "emergency",
    aiConfidence: 96,
    department: "water_supply",
    status: "in_progress",
    reportedDate: "2026-09-09T06:10:00Z",
    expectedResolutionDate: "2026-09-10T16:00:00Z",
    resolvedDate: null,
    assignedOfficer: "V. Natarajan (Metro Water Executive Engineer)",
    upvotes: 62,
    hasUserUpvoted: true,
    verifiedByCitizen: false,
    sensitiveArea: {
      nearSchool: false,
      nearHospital: true,
      mainRoad: true,
      publicSafety: true
    },
    timeline: [
      {
        status: "reported",
        title: "Emergency Alert Logged",
        description: "High priority flag triggered automatically due to drinking water pipeline rupture on commercial artery.",
        timestamp: "2026-09-09T06:10:00Z",
        actor: "Citizen Portal"
      },
      {
        status: "verified",
        title: "Immediate Verification",
        description: "Control room shut off upstream valve to prevent wastage.",
        timestamp: "2026-09-09T06:40:00Z",
        actor: "Control Room"
      },
      {
        status: "assigned",
        title: "Emergency Repair Team Dispatched",
        description: "Assigned to Zone 10 emergency plumbing crew.",
        timestamp: "2026-09-09T07:15:00Z",
        actor: "Metro Water"
      },
      {
        status: "in_progress",
        title: "Excavation & Pipe Replacement",
        description: "Backhoe loader on site excavating burst 200mm cast iron pipe.",
        timestamp: "2026-09-09T09:00:00Z",
        actor: "Site Engineer"
      }
    ],
    comments: [
      {
        id: "c5",
        author: "Shopkeepers Forum",
        role: "Citizen",
        text: "Water entered two basement shops. Valve shutoff helped, waiting for pipe weld.",
        timestamp: "2026-09-09T08:30:00Z"
      }
    ]
  },
  {
    id: "NCC-2026-00121",
    category: "drainage",
    title: "Stormwater Drainage Blockage",
    description: "Plastic and construction silt choking stormwater entry grills. Waterlogging during brief rains.",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
    resolutionImage: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
    address: "Luz Church Road, Mylapore, Chennai - 600004",
    lat: 13.0339,
    lng: 80.2677,
    severity: "high",
    priority: "high",
    aiConfidence: 89,
    department: "drainage",
    status: "resolved",
    reportedDate: "2026-09-05T11:00:00Z",
    expectedResolutionDate: "2026-09-08T18:00:00Z",
    resolvedDate: "2026-09-07T17:00:00Z",
    assignedOfficer: "K. Elango (Drainage AE)",
    upvotes: 34,
    hasUserUpvoted: false,
    verifiedByCitizen: true,
    sensitiveArea: {
      nearSchool: true,
      nearHospital: false,
      mainRoad: false,
      publicSafety: true
    },
    timeline: [
      {
        status: "reported",
        title: "Complaint Registered",
        description: "Logged by local resident.",
        timestamp: "2026-09-05T11:00:00Z",
        actor: "Citizen Portal"
      },
      {
        status: "verified",
        title: "Inspected by Ward AE",
        description: "Desilting required across 150m stretch.",
        timestamp: "2026-09-05T15:00:00Z",
        actor: "Ward AE"
      },
      {
        status: "assigned",
        title: "Assigned to Desilting Wing",
        description: "Suction super sucker vehicle scheduled.",
        timestamp: "2026-09-06T09:00:00Z",
        actor: "Drainage Dept"
      },
      {
        status: "in_progress",
        title: "Suction Operation",
        description: "Drain opened and cleared of 2 truckloads of silt.",
        timestamp: "2026-09-07T10:00:00Z",
        actor: "Sanitation Crew"
      },
      {
        status: "resolved",
        title: "Resolved & Inspected",
        description: "Drain flow restored and grates reinforced.",
        timestamp: "2026-09-07T17:00:00Z",
        actor: "Zonal Officer"
      }
    ],
    comments: []
  },
  {
    id: "NCC-2026-00120",
    category: "environmental",
    title: "Large Tree Branch Dangling over Road",
    description: "Heavy storm loosened banyan branch hanging precariously above electrical cables and road.",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
    resolutionImage: null,
    address: "GST Road near Railway Station, Tambaram, Chennai - 600045",
    lat: 12.9249,
    lng: 80.1000,
    severity: "emergency",
    priority: "emergency",
    aiConfidence: 92,
    department: "environmental",
    status: "assigned",
    reportedDate: "2026-09-09T11:15:00Z",
    expectedResolutionDate: "2026-09-10T14:00:00Z",
    resolvedDate: null,
    assignedOfficer: "P. Rajendran (Horticulture Officer)",
    upvotes: 51,
    hasUserUpvoted: false,
    verifiedByCitizen: false,
    sensitiveArea: {
      nearSchool: false,
      nearHospital: false,
      mainRoad: true,
      publicSafety: true
    },
    timeline: [
      {
        status: "reported",
        title: "Registered as Emergency Hazard",
        description: "Public safety risk triggered by dangling branch.",
        timestamp: "2026-09-09T11:15:00Z",
        actor: "Citizen Portal"
      },
      {
        status: "verified",
        title: "Tree Pruning Requisition",
        description: "Verified by Parks & Greenery officer.",
        timestamp: "2026-09-09T12:00:00Z",
        actor: "Horticulture Officer"
      },
      {
        status: "assigned",
        title: "Hydraulic Crane Assigned",
        description: "Pruning vehicle en route.",
        timestamp: "2026-09-09T13:30:00Z",
        actor: "Disaster Cell"
      }
    ],
    comments: []
  }
];
