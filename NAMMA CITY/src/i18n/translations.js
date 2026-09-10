export const translations = {
  en: {
    // App Branding
    appTitle: "Namma City Care",
    appSubTitle: "AI-Based Civic Issue Reporting & Resolution System",
    tagline: "Report. Track. Improve Our City.",
    govtBadge: "Greater City Municipal Corporation",

    // Navigation
    nav: {
      home: "Home",
      reportIssue: "Report Issue",
      trackComplaint: "Track Complaint",
      liveMap: "Civic Map",
      nearbyIssues: "Nearby Issues",
      emergencyHelp: "Emergency Help",
      citizenDashboard: "My Dashboard",
      adminPortal: "Admin Portal",
      about: "About",
      roleCitizen: "Citizen View",
      roleAdmin: "Officer Portal",
      languageToggle: "தமிழ்"
    },

    // Hero Section
    hero: {
      headline: "Your City. Your Voice. Your Responsibility.",
      subheadline: "Report civic problems with photos and location, let AI identify the issue, and track its resolution in real-time.",
      ctaReport: "Report a Civic Issue",
      ctaTrack: "Track Existing Complaint",
      ctaNearby: "View Issues Near Me",
      stats: {
        totalReported: "Total Reports",
        resolvedCount: "Resolved Issues",
        resolutionRate: "Resolution Rate",
        avgTime: "Avg Resolution Time"
      }
    },

    // Categories
    categories: {
      garbage: "Garbage Accumulation",
      pothole: "Pothole",
      streetlight: "Streetlight Outage",
      water_leakage: "Water Leakage",
      damaged_road: "Damaged Road",
      drainage: "Drainage Overflow",
      environmental: "Environmental Issue",
      other: "Other Issues"
    },

    categoryDescriptions: {
      garbage: "Overflowing bins, uncollected waste, street debris",
      pothole: "Deep road craters, broken tarmac, traffic hazards",
      streetlight: "Dark lamps, broken poles, flickering lights",
      water_leakage: "Broken pipeline, potable water loss, pipe burst",
      damaged_road: "Cracked surface, cave-ins, eroded road edges",
      drainage: "Stagnant sewage, clogged stormwater drains",
      environmental: "Fallen tree branches, illegal burning, air pollution",
      other: "Encroachments, public facility damages, graffiti"
    },

    // Priorities
    priorities: {
      low: "Low",
      medium: "Medium",
      high: "High",
      emergency: "Emergency"
    },

    priorityTooltips: {
      emergency: "Immediate safety hazard or critical public-service collapse",
      high: "Major public impact near school, hospital or main artery",
      medium: "Important civic issue affecting daily commute or sanitation",
      low: "Minor routine maintenance"
    },

    // Statuses
    statuses: {
      reported: "Reported",
      verified: "Verified",
      assigned: "Assigned",
      in_progress: "In Progress",
      resolved: "Resolved"
    },

    // Departments
    departments: {
      waste_management: "Waste Management Department",
      roads_highways: "Roads & Highways Department",
      water_supply: "Metro Water & Sewerage Board",
      electricity: "Electricity Board (TANGEDCO)",
      drainage: "Stormwater Drainage Department",
      environmental: "Environmental Protection & Parks",
      municipal_corp: "Greater City Municipal Corporation"
    },

    // Smart Reporting Form
    report: {
      title: "Report a Civic Issue",
      subtitle: "Submit details with photo and location. Our AI will analyze and route it to the right department.",
      uploadPhoto: "Upload Photo / Take Picture",
      dragDrop: "Drag and drop or click to browse files (JPG, PNG)",
      samplePhotosPrompt: "Or choose a sample problem photo to test AI:",
      samples: {
        garbage: "Sample Garbage",
        pothole: "Sample Pothole",
        streetlight: "Sample Streetlight",
        water: "Sample Water Leak",
        drainage: "Sample Drainage"
      },
      aiAnalysisTitle: "AI Vision Analysis",
      aiAnalyzing: "AI is analyzing image features & civic impact...",
      aiConfidence: "AI Confidence",
      aiDetectedIssue: "Detected Issue",
      aiSuggestedPriority: "Suggested Priority",
      aiRecommendedDept: "Recommended Department",
      aiOverrideNotice: "Citizen review: You can change the category, priority, or department if the AI suggestion differs.",
      categoryLabel: "Civic Issue Category",
      descriptionLabel: "Description of the Issue",
      descriptionPlaceholder: "Describe the exact issue, landmark, or specific risk...",
      severityLabel: "Citizen Severity Assessment",
      locationLabel: "Location Details",
      addressPlaceholder: "e.g., 4th Main Road, Anna Nagar West, near Metro Station",
      useMyLocation: "Use My GPS Location",
      pickOnMap: "Select Location on Map",
      sensitiveAreaLabel: "Nearby Sensitive Infrastructure (Increases Priority)",
      nearSchool: "Near School / College",
      nearHospital: "Near Hospital / Clinic",
      mainRoad: "On Main Arterial Road / Bus Route",
      publicSafety: "Public Safety Hazard / Water Supply",
      submitBtn: "Submit Civic Complaint",
      submitting: "Submitting...",
      validation: {
        photoRequired: "Please upload or select an issue photo",
        categoryRequired: "Please select an issue category",
        descRequired: "Please enter a brief description (min 10 characters)",
        locationRequired: "Please provide an address or GPS coordinate"
      }
    },

    // Duplicate Detection Modal
    duplicate: {
      title: "Potential Duplicate Issue Detected!",
      alertMsg: "A similar issue has already been reported near this location within 300 meters.",
      existingId: "Existing Complaint ID",
      supportBtn: "Support / Upvote Existing Complaint",
      submitAnywayBtn: "Submit as New Complaint",
      closeBtn: "Cancel"
    },

    // Success Screen
    success: {
      title: "Complaint Submitted Successfully!",
      subtitle: "Your report has been logged with the municipal grievance redressal system.",
      yourId: "Your Unique Complaint ID",
      copyNotice: "Keep this ID to track your complaint progress and receive SMS/email updates.",
      trackBtn: "Track This Complaint Now",
      backHomeBtn: "Back to Home",
      copied: "Copied to clipboard!"
    },

    // Track Complaint
    track: {
      title: "Track Your Civic Complaint",
      subtitle: "Enter your unique Complaint ID to view live progress, officer assignments, and resolution photos.",
      searchPlaceholder: "Enter Complaint ID (e.g., NCC-2026-00125)",
      searchBtn: "Track",
      recentSearches: "Recent Complaint IDs:",
      notFoundTitle: "No Complaint Found",
      notFoundMsg: "We could not find a complaint matching that ID. Please check the number and try again.",
      detailsTitle: "Complaint Information",
      reportedOn: "Reported On",
      expectedResolution: "Expected Resolution Date",
      currentOfficer: "Assigned Official",
      deptNotes: "Department Notes & Progress Log",
      resolutionProof: "Official Resolution Photo",
      beforeAfter: "Before & After Verification",
      citizenActions: "Citizen Community Actions",
      upvoteBtn: "Upvote Complaint",
      upvoteCount: "citizens support this complaint",
      stillExistsBtn: "Report Issue Still Exists",
      verifyResolvedBtn: "Verify & Confirm Resolution",
      verifiedByCitizen: "Verified as Resolved by Citizens",
      addCommentBtn: "Add Comment / Feedback",
      commentPlaceholder: "Add a note or update for ward officers..."
    },

    // Live Map
    map: {
      title: "Live Civic Issues Map",
      subtitle: "Real-time geographical view of civic problems reported across the city.",
      filters: {
        all: "All Issues",
        open: "Open / Reported",
        inProgress: "In Progress",
        resolved: "Resolved",
        emergency: "Emergency Only"
      },
      legend: "Map Legend",
      clickMarkerHint: "Click any pin on the map to view details and track",
      viewDetails: "View & Track"
    },

    // Nearby Issues
    nearby: {
      title: "Civic Issues Near Me",
      subtitle: "View problems reported in your immediate neighborhood. Upvote issues to expedite municipal action.",
      requestGps: "Detect My Current Location",
      detectedAt: "Showing issues within radius of your coordinates",
      foundCount: "{count} civic issues found within 3 km of your location",
      distanceAway: "{dist} km away",
      supportThis: "Support Issue"
    },

    // Citizen Dashboard
    dashboard: {
      welcome: "Citizen Grievance Portal",
      stats: {
        myReports: "My Total Reports",
        pending: "Pending / In Progress",
        resolved: "Successfully Resolved",
        upvotesReceived: "Community Upvotes"
      },
      tabs: {
        all: "All My Reports",
        active: "Active / In Progress",
        resolved: "Resolved",
        notifications: "Notification Feed"
      },
      noComplaints: "No complaints found in this category.",
      notificationsTitle: "Municipal Updates & Alerts",
      markAllRead: "Mark all as read"
    },

    // Admin Dashboard
    admin: {
      title: "Municipal Command & Redressal Portal",
      subtitle: "Official municipal dashboard for verification, department triage, and SLA resolution tracking.",
      badge: "Authorized Official Access",
      stats: {
        total: "Total Complaints",
        newReports: "New Reports (Action Needed)",
        highPriority: "High Priority",
        emergency: "Emergency Alerts",
        resolved: "Total Resolved",
        avgSla: "Average Resolution Time"
      },
      filters: {
        allDepts: "All Departments",
        allStatuses: "All Statuses",
        allPriorities: "All Priorities",
        searchPlaceholder: "Search ID, location, or keyword..."
      },
      table: {
        id: "Complaint ID",
        issue: "Category & Description",
        location: "Ward / Location",
        priority: "Priority",
        department: "Assigned Department",
        status: "Status",
        date: "Date Reported",
        actions: "Actions"
      },
      actions: {
        verify: "Verify",
        assign: "Assign Dept",
        inProgress: "Start Work",
        resolve: "Mark Resolved",
        rejectDuplicate: "Reject (Duplicate)",
        rejectSpam: "Reject (Invalid/Spam)",
        viewDetails: "Inspect"
      },
      modal: {
        title: "Officer Management Panel",
        updateStatus: "Update Workflow Status",
        changeDept: "Assign / Transfer Department",
        changePriority: "Adjust Official Priority",
        addOfficerNote: "Officer Log / Work Order Comments",
        notePlaceholder: "Add inspection findings, contractor assigned, or work summary...",
        uploadResolutionPhoto: "Attach Resolution Photo Proof",
        saveChanges: "Save & Dispatch Updates"
      }
    },

    // Reports & Analytics
    analytics: {
      title: "Civic Reports & Analytics",
      subtitle: "Transparency metrics, category breakdown, ward performance, and resolution SLA trends.",
      categoryBreakdown: "Complaints by Category",
      statusDistribution: "Resolution Status Breakdown",
      deptPerformance: "Department Workload & Performance",
      prioritySpread: "Priority Level Distribution",
      exportCsv: "Export CSV Report",
      generateReport: "Generate Municipal Summary",
      reportGenerated: "Report generated successfully!"
    },

    // Emergency Page
    emergency: {
      title: "Emergency Civic & Safety Contacts",
      subtitle: "Immediate emergency contact numbers for life-threatening hazards and municipal disaster response.",
      disclaimer: "Official Warning: This civic web application is for reporting non-life-threatening public infrastructure problems. For immediate danger, life threats, crime, or medical emergencies, please dial the official emergency numbers directly.",
      callBtn: "Call Now",
      helplines: {
        police: { name: "Police Emergency", number: "100 / 112", desc: "For crime, law & order, and urgent safety threats" },
        ambulance: { name: "Ambulance / Medical", number: "108", desc: "Emergency medical response and trauma services" },
        fire: { name: "Fire & Rescue", number: "101", desc: "Fire incidents, structural collapse, and flood rescue" },
        corporation: { name: "City Municipal Helpline", number: "1913", desc: "24x7 municipal emergency control room & flood alerts" },
        disaster: { name: "Disaster Management", number: "1077", desc: "Cyclone, heavy rain inundation, and state disaster relief" },
        women: { name: "Women Safety Helpline", number: "1091", desc: "Emergency support and round-the-clock protection" },
        child: { name: "Childline Helpline", number: "1098", desc: "Care, protection, and emergency rescue for children" }
      }
    },

    // Common
    common: {
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      view: "View",
      track: "Track",
      support: "Support",
      back: "Back",
      loading: "Loading...",
      daysAgo: "days ago",
      hoursAgo: "hours ago",
      justNow: "Just now",
      all: "All",
      date: "Date",
      status: "Status",
      priority: "Priority"
    }
  },

  ta: {
    // App Branding
    appTitle: "நம்ம சிட்டி கேர்",
    appSubTitle: "AI-அடிப்படையிலான இருமொழி குடிமக்கள் குறைதீர்க்கும் தளம்",
    tagline: "புகாரளிப்போம். கண்காணிப்போம். நகரத்தை மேம்படுத்துவோம்.",
    govtBadge: "பெருநகர மாநகராட்சி சேவை",

    // Navigation
    nav: {
      home: "முகப்பு",
      reportIssue: "புகாரளிக்கவும்",
      trackComplaint: "புகாரை கண்காணிக்க",
      liveMap: "நகர வரைபடம்",
      nearbyIssues: "அருகிலுள்ள பிரச்சினைகள்",
      emergencyHelp: "அவசர உதவி",
      citizenDashboard: "என் புகார்கள்",
      adminPortal: "அதிகாரிகள் தளம்",
      about: "பற்றி",
      roleCitizen: "குடிமக்கள் பக்கம்",
      roleAdmin: "அதிகாரிகள் பக்கம்",
      languageToggle: "English"
    },

    // Hero Section
    hero: {
      headline: "உங்கள் நகரம். உங்கள் குரல். உங்கள் பொறுப்பு.",
      subheadline: "புகைப்படம் மற்றும் இருப்பிடத்துடன் நகரப் பிரச்சினைகளைப் புகாரளித்து, AI மூலம் பிரச்சினையை கண்டறிந்து, அதன் தீர்வு நிலையை கண்காணிக்கவும்.",
      ctaReport: "குடிமக்கள் பிரச்சினையைப் புகாரளிக்கவும்",
      ctaTrack: "புகார் நிலையை கண்காணிக்கவும்",
      ctaNearby: "அருகிலுள்ள பிரச்சினைகள்",
      stats: {
        totalReported: "மொத்தப் புகார்கள்",
        resolvedCount: "தீர்வு காணப்பட்டவை",
        resolutionRate: "தீர்வு விகிதம்",
        avgTime: "சராசரி தீர்வு காலம்"
      }
    },

    // Categories
    categories: {
      garbage: "குப்பை தேக்கம்",
      pothole: "சாலை பள்ளம்",
      streetlight: "தெருவிளக்கு பழுது",
      water_leakage: "குடிநீர் கசிவு",
      damaged_road: "சேதமடைந்த சாலை",
      drainage: "வடிகால் அடைப்பு",
      environmental: "சுற்றுச்சூழல் பிரச்சினை",
      other: "பிற பிரச்சினைகள்"
    },

    categoryDescriptions: {
      garbage: "சாலையோர குப்பைக் குவியல், சேகரிக்கப்படாத கழிவுகள்",
      pothole: "ஆபத்தான குழிகள், உடைந்த தார்ச் சாலை",
      streetlight: "எரியாத விளக்குகள், சேதமடைந்த மின்கம்பங்கள்",
      water_leakage: "உடைந்த குழாய், வீணாகும் குடிநீர், குழாய் வெடிப்பு",
      damaged_road: "விரிசல் அடைந்த சாலை, சேதமடைந்த நடைபாதை",
      drainage: "தேங்கிய கழிவுநீர், அடைக்கப்பட்ட மழைநீர் வடிகால்",
      environmental: "முறிந்த மரக்கிளைகள், சட்டவிரோத குப்பை எரிப்பு",
      other: "ஆக்கிரமிப்புகள், பொதுச் சொத்து சேதங்கள்"
    },

    // Priorities
    priorities: {
      low: "குறைவு",
      medium: "நடுத்தரம்",
      high: "அதிகம்",
      emergency: "அவசரம்"
    },

    priorityTooltips: {
      emergency: "உடனடி உயிர் பாதுகாப்பு அல்லது அத்தியாவசிய சேவைகள் பாதிப்பு",
      high: "பள்ளி, மருத்துவமனை அல்லது முக்கிய சாலைகளில் பெரும் பாதிப்பு",
      medium: "தினசரி பயணத்தையும் சுகாதாரத்தையும் பாதிக்கும் முக்கிய பிரச்சினை",
      low: "சாதாரண பராமரிப்பு வேலை"
    },

    // Statuses
    statuses: {
      reported: "புகாரளிக்கப்பட்டது",
      verified: "சரிபார்க்கப்பட்டது",
      assigned: "ஒதுக்கப்பட்டது",
      in_progress: "பணியில் உள்ளது",
      resolved: "தீர்வு காணப்பட்டது"
    },

    // Departments
    departments: {
      waste_management: "குப்பை மேலாண்மைத் துறை",
      roads_highways: "சாலைகள் மற்றும் நெடுஞ்சாலைகள் துறை",
      water_supply: "குடிநீர் வழங்கல் மற்றும் கழிவுநீரகற்று வாரியம்",
      electricity: "மின்சார வாரியம் (TANGEDCO)",
      drainage: "மழைநீர் வடிகால் துறை",
      environmental: "சுற்றுச்சூழல் மற்றும் பூங்காக்கள் துறை",
      municipal_corp: "பெருநகர மாநகராட்சி பொது நிர்வாகம்"
    },

    // Smart Reporting Form
    report: {
      title: "குடிமக்கள் பிரச்சினையைப் புகாரளிக்கவும்",
      subtitle: "புகைப்படம் மற்றும் இருப்பிடத்துடன் விவரங்களை சமர்ப்பிக்கவும். எங்கள் AI தானாக பகுப்பாய்வு செய்து சரியான துறைக்கு அனுப்பும்.",
      uploadPhoto: "புகைப்படம் பதிவேற்றவும் / படம் எடுக்கவும்",
      dragDrop: "படத்தை இழுத்துப் போடவும் அல்லது கிளிக் செய்யவும் (JPG, PNG)",
      samplePhotosPrompt: "அல்லது AI பரிசோதிக்க மாதிரி புகைப்படத்தை தேர்ந்தெடுக்கவும்:",
      samples: {
        garbage: "மாதிரி குப்பை",
        pothole: "மாதிரி சாலை பள்ளம்",
        streetlight: "மாதிரி தெருவிளக்கு",
        water: "மாதிரி குடிநீர் கசிவு",
        drainage: "மாதிரி வடிகால்"
      },
      aiAnalysisTitle: "AI புகைப்பட பகுப்பாய்வு",
      aiAnalyzing: "AI படத்தின் அம்சங்களையும் பொதுப் பாதிப்பையும் ஆராய்கிறது...",
      aiConfidence: "நம்பகத்தன்மை",
      aiDetectedIssue: "கண்டறியப்பட்ட பிரச்சினை",
      aiSuggestedPriority: "முன்னுரிமை",
      aiRecommendedDept: "பரிந்துரைக்கப்பட்ட துறை",
      aiOverrideNotice: "குடிமக்கள் தேர்வு: AI பரிந்துரையில் மாற்றம் இருந்தால் நீங்கள் துறை அல்லது முன்னுரிமையை மாற்றிக்கொள்ளலாம்.",
      categoryLabel: "பிரச்சினை வகை",
      descriptionLabel: "பிரச்சினையின் விவரம்",
      descriptionPlaceholder: "சரியான இடம், அடையாளக் குறி மற்றும் பாதிப்பை விவரிக்கவும்...",
      severityLabel: "தீவிரத்தன்மை மதிப்பீடு",
      locationLabel: "இருப்பிட விவரங்கள்",
      addressPlaceholder: "எ.கா: 4வது மெயின் ரோடு, அண்ணா நகர் மேற்கு, மெட்ரோ நிலையம் அருகில்",
      useMyLocation: "என் இருப்பிடத்தைப் பெறவும் (GPS)",
      pickOnMap: "வரைபடத்தில் தேர்வு செய்யவும்",
      sensitiveAreaLabel: "அருகிலுள்ள முக்கிய இடங்கள் (முன்னுரிமையை உயர்த்தும்)",
      nearSchool: "பள்ளி / கல்லூரி அருகில்",
      nearHospital: "மருத்துவமனை அருகில்",
      mainRoad: "முக்கிய பேருந்து சாலை",
      publicSafety: "பொதுப் பாதுகாப்பு அச்சுறுத்தல் / குடிநீர் பாதிப்பு",
      submitBtn: "புகாரைச் சமர்ப்பிக்கவும்",
      submitting: "சமர்ப்பிக்கப்படுகிறது...",
      validation: {
        photoRequired: "தயவுசெய்து ஒரு புகைப்படத்தை பதிவேற்றவும்",
        categoryRequired: "தயவுசெய்து பிரச்சினை வகையைத் தேர்ந்தெடுக்கவும்",
        descRequired: "தயவுசெய்து சுருக்கமான விளக்கத்தை உள்ளிடவும் (குறைந்தது 10 எழுத்துக்கள்)",
        locationRequired: "தயவுசெய்து இருப்பிட முகவரியை குறிப்பிடவும்"
      }
    },

    // Duplicate Detection Modal
    duplicate: {
      title: "ஏற்கனவே பதிவான பிரச்சினை கண்டறியப்பட்டது!",
      alertMsg: "இந்த இடத்திற்கு அருகில் (300 மீட்டருக்குள்) இதே போன்ற பிரச்சினை ஏற்கனவே புகாரளிக்கப்பட்டுள்ளது.",
      existingId: "ஏற்கனவே உள்ள புகார் எண்",
      supportBtn: "ஏற்கனவே உள்ள புகாரை ஆதரிக்கவும் (Upvote)",
      submitAnywayBtn: "புதிய புகாராக சமர்ப்பிக்கவும்",
      closeBtn: "ரத்து செய்"
    },

    // Success Screen
    success: {
      title: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
      subtitle: "உங்கள் புகார் மாநகராட்சி குறைதீர்க்கும் அமைப்பில் பதிவு செய்யப்பட்டுள்ளது.",
      yourId: "உங்கள் பிரத்யேக புகார் எண்",
      copyNotice: "புகாரின் நிலையைக் கண்காணிக்க இந்த எண்ணைப் பயன்படுத்தவும்.",
      trackBtn: "புகாரை இப்போது கண்காணிக்கவும்",
      backHomeBtn: "முகப்பிற்குச் செல்லவும்",
      copied: "நகலெடுக்கப்பட்டது!"
    },

    // Track Complaint
    track: {
      title: "புகார் நிலையை கண்காணிக்கவும்",
      subtitle: "நேரலை முன்னேற்றம், ஒதுக்கப்பட்ட அதிகாரி மற்றும் தீர்வு புகைப்படங்களைக் காண உங்கள் புகார் எண்ணை உள்ளிடவும்.",
      searchPlaceholder: "புகார் எண்ணை உள்ளிடவும் (எ.கா: NCC-2026-00125)",
      searchBtn: "கண்காணி",
      recentSearches: "சமீபத்திய புகார் எண்கள்:",
      notFoundTitle: "புகார் கிடைக்கவில்லை",
      notFoundMsg: "இந்த எண்ணில் எந்தப் புகாரும் காணப்படவில்லை. சரியான எண்ணை உள்ளிட்டீர்களா என சரிபார்க்கவும்.",
      detailsTitle: "புகார் விவரங்கள்",
      reportedOn: "புகாரளிக்கப்பட்ட தேதி",
      expectedResolution: "எதிர்பார்க்கப்படும் தீர்வு தேதி",
      currentOfficer: "ஒதுக்கப்பட்ட அதிகாரி",
      deptNotes: "துறை அதிகாரியின் குறிப்புகள் & முன்னேற்றம்",
      resolutionProof: "அதிகாரப்பூர்வ தீர்வு புகைப்படம்",
      beforeAfter: "முன்னும் பின்னும் ஒப்பீடு",
      citizenActions: "குடிமக்கள் சமூக நடவடிக்கைகள்",
      upvoteBtn: "புகாரை ஆதரிக்கவும் (Upvote)",
      upvoteCount: "குடிமக்கள் இந்த புகாரை ஆதரித்துள்ளனர்",
      stillExistsBtn: "பிரச்சினை இன்னும் உள்ளது என அறிவிக்க",
      verifyResolvedBtn: "தீர்வை உறுதி செய்யவும் (Verify)",
      verifiedByCitizen: "குடிமக்களால் தீர்வு உறுதி செய்யப்பட்டது",
      addCommentBtn: "கருத்து சேர்க்க",
      commentPlaceholder: "அதிகாரிகளுக்கு தகவல் அல்லது கருத்தைச் சேர்க்கவும்..."
    },

    // Live Map
    map: {
      title: "நேரலை நகரப் புகார்கள் வரைபடம்",
      subtitle: "நகரம் முழுவதும் புகாரளிக்கப்பட்ட பிரச்சினைகளின் வரைபடக் காட்சி.",
      filters: {
        all: "அனைத்து பிரச்சினைகள்",
        open: "புதியவை",
        inProgress: "பணியில் உள்ளவை",
        resolved: "தீர்க்கப்பட்டவை",
        emergency: "அவசரப் பிரச்சினைகள்"
      },
      legend: "வரைபடக் குறியீடுகள்",
      clickMarkerHint: "விவரங்களைக் காண வரைபடத்தில் உள்ள குறியீட்டைக் கிளிக் செய்யவும்",
      viewDetails: "விவரங்களை பார்க்க"
    },

    // Nearby Issues
    nearby: {
      title: "என்னைச் சுற்றியுள்ள பிரச்சினைகள்",
      subtitle: "உங்கள் சுற்றுவட்டாரத்தில் பதிவான பிரச்சினைகளைப் பார்த்து விரைவான தீர்வுக்கு ஆதரவளியுங்கள்.",
      requestGps: "என் இருப்பிடத்தைக் கண்டறியவும் (GPS)",
      detectedAt: "உங்கள் இருப்பிடத்திலிருந்து கணக்கிடப்பட்ட புகார்கள்",
      foundCount: "உங்கள் இருப்பிடத்திலிருந்து 3 கி.மீ சுற்றளவில் {count} பிரச்சினைகள் உள்ளன",
      distanceAway: "{dist} கி.மீ தொலைவில்",
      supportThis: "ஆதரவளிக்கவும்"
    },

    // Citizen Dashboard
    dashboard: {
      welcome: "குடிமக்கள் குறைதீர்ப்பு தளம்",
      stats: {
        myReports: "என் மொத்தப் புகார்கள்",
        pending: "நடவடிக்கையில் உள்ளவை",
        resolved: "தீர்க்கப்பட்டவை",
        upvotesReceived: "கிடைத்த ஆதரவுகள்"
      },
      tabs: {
        all: "அனைத்து புகார்கள்",
        active: "நடவடிக்கையில் உள்ளவை",
        resolved: "தீர்க்கப்பட்டவை",
        notifications: "அறிவிப்புகள்"
      },
      noComplaints: "இப்பிரிவில் எந்தப் புகாரும் இல்லை.",
      notificationsTitle: "மாநகராட்சி அறிவிப்புகள்",
      markAllRead: "அனைத்தையும் படித்ததாகக் குறிக்கவும்"
    },

    // Admin Dashboard
    admin: {
      title: "மாநகராட்சி அதிகாரிகள் குறைதீர்ப்பு மையம்",
      subtitle: "புகார்களை சரிபார்க்கவும், துறைகளுக்கு ஒதுக்கவும், தீர்வுகளைக் கண்காணிக்கவுமான அதிகாரப்பூர்வ தளம்.",
      badge: "அங்கீகரிக்கப்பட்ட அதிகாரி நுழைவு",
      stats: {
        total: "மொத்தப் புகார்கள்",
        newReports: "புதிய புகார்கள் (நடவடிக்கை தேவை)",
        highPriority: "முக்கிய புகார்கள்",
        emergency: "அவசர புகார்கள்",
        resolved: "தீர்க்கப்பட்ட புகார்கள்",
        avgSla: "சராசரி தீர்வு காலம்"
      },
      filters: {
        allDepts: "அனைத்து துறைகள்",
        allStatuses: "அனைத்து நிலைகள்",
        allPriorities: "அனைத்து முன்னுரிமைகள்",
        searchPlaceholder: "எண், இருப்பிடம் அல்லது சொல்லைத் தேடவும்..."
      },
      table: {
        id: "புகார் எண்",
        issue: "வகை & விளக்கம்",
        location: "வார்டு / இருப்பிடம்",
        priority: "முன்னுரிமை",
        department: "ஒதுக்கப்பட்ட துறை",
        status: "நிலை",
        date: "தேதி",
        actions: "நடவடிக்கை"
      },
      actions: {
        verify: "சரிபார்",
        assign: "துறை ஒதுக்கீடு",
        inProgress: "பணியைத் தொடங்கு",
        resolve: "தீர்வு காணப்பட்டது",
        rejectDuplicate: "நிராகரி (நகல்)",
        rejectSpam: "நிராகரி (போலி)",
        viewDetails: "பார்வையிடு"
      },
      modal: {
        title: "அதிகாரி நிர்வாக பலகை",
        updateStatus: "பணி நிலையை மாற்றுக",
        changeDept: "துறையை மாற்றுக",
        changePriority: "முன்னுரிமையை மாற்றுக",
        addOfficerNote: "அதிகாரியின் பணி ஆய்வுக் குறிப்பு",
        notePlaceholder: "ஆய்வு முடிவுகள், ஒப்பந்ததாரர் விவரம் அல்லது பணி நிலையை உள்ளிடவும்...",
        uploadResolutionPhoto: "தீர்வு புகைப்பட ஆதாரத்தை இணைக்கவும்",
        saveChanges: "சேமித்து அனுப்புக"
      }
    },

    // Reports & Analytics
    analytics: {
      title: "நகர அறிக்கைகள் & புள்ளிவிவரங்கள்",
      subtitle: "புகார்களின் வகைப்பாடு, வார்டு அளவிலான செயல்திறன் மற்றும் தீர்வு கால அளவுகோல்.",
      categoryBreakdown: "வகைவாரியான புகார்கள்",
      statusDistribution: "தீர்வு நிலை பகிர்வு",
      deptPerformance: "துறை வாரியான பணிச்சுமையும் தீர்வும்",
      prioritySpread: "முன்னுரிமை பகிர்வு",
      exportCsv: "CSV அறிக்கையாக பதிவிறக்குக",
      generateReport: "அறிக்கையை உருவாக்கு",
      reportGenerated: "அறிக்கை வெற்றிகரமாக உருவாக்கப்பட்டது!"
    },

    // Emergency Page
    emergency: {
      title: "அவசர உதவி & பாதுகாப்பு எண்கள்",
      subtitle: "உயிர் பாதுகாப்பு அச்சுறுத்தல்கள் மற்றும் அவசர பேரிடர் உதவி எண்கள்.",
      disclaimer: "அதிகாரப்பூர்வ எச்சரிக்கை: இந்த தளம் அவசரமில்லாத நகர்ப்புற உள்கட்டமைப்பு பிரச்சினைகளுக்கானது. அவசர ஆபத்து அல்லது மருத்துவ உதவிக்கு நேரடியாக கீழேயுள்ள அதிகாரப்பூர்வ அவசர உதவி எண்களைத் தொடர்பு கொள்ளவும்.",
      callBtn: "அழைக்கவும்",
      helplines: {
        police: { name: "காவல்துறை அவசர உதவி", number: "100 / 112", desc: "குற்றத் தடுப்பு, சட்டம்-ஒழுங்கு மற்றும் பாதுகாப்புக்கு" },
        ambulance: { name: "ஆம்புலன்ஸ் / அவசர சிகிச்சை", number: "108", desc: "அவசர மருத்துவ உதவி மற்றும் விபத்து சிகிச்சை" },
        fire: { name: "தீயணைப்பு & மீட்புப்பணி", number: "101", desc: "தீ விபத்து, கட்டட இடிபாடுகள் மற்றும் மீட்புப் பணிகள்" },
        corporation: { name: "மாநகராட்சி அவசர உதவி", number: "1913", desc: "24x7 மாநகராட்சி அவசர கட்டுப்பாட்டு அறை" },
        disaster: { name: "பேரிடர் மேலாண்மை", number: "1077", desc: "புயல், வெள்ளப்பெருக்கு மற்றும் பேரிடர் நிவாரணம்" },
        women: { name: "பெண்கள் பாதுகாப்பு உதவி", number: "1091", desc: "பெண்களுக்கான 24 மணி நேர அவசர பாதுகாப்பு சேவை" },
        child: { name: "குழந்தைகள் உதவி மையம்", number: "1098", desc: "குழந்தைகள் பாதுகாப்பு மற்றும் பராமரிப்பு சேவை" }
      }
    },

    // Common
    common: {
      close: "மூடுக",
      cancel: "ரத்து செய்",
      save: "சேமி",
      view: "பார்வை",
      track: "கண்காணி",
      support: "ஆதரி",
      back: "பின்செல்ல",
      loading: "ஏற்றப்படுகிறது...",
      daysAgo: "நாட்களுக்கு முன்",
      hoursAgo: "மணிநேரத்திற்கு முன்",
      justNow: "சற்றுமுன்",
      all: "அனைத்தும்",
      date: "தேதி",
      status: "நிலை",
      priority: "முன்னுரிமை"
    }
  }
};
