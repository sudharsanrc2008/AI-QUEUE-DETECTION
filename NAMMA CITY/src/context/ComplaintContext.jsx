import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialComplaints } from '../data/initialComplaints';

const ComplaintContext = createContext();

// Distance calculation using Haversine formula (km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('namma_city_complaints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading stored complaints', e);
      }
    }
    return initialComplaints;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('namma_city_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'notif_1',
        complaintId: 'NCC-2026-00125',
        titleEn: 'Compactor Assigned to Anna Nagar',
        titleTa: 'அண்ணா நகர் குப்பை அகற்ற வாகனம் ஒதுக்கப்பட்டது',
        messageEn: 'Your complaint NCC-2026-00125 has been assigned to the Waste Management Department.',
        messageTa: 'உங்கள் புகார் NCC-2026-00125 குப்பை மேலாண்மைத் துறைக்கு ஒதுக்கப்பட்டுள்ளது.',
        timestamp: '2026-09-09T08:15:00Z',
        read: false,
        type: 'info'
      },
      {
        id: 'notif_2',
        complaintId: 'NCC-2026-00123',
        titleEn: 'Streetlight Repaired & Resolved',
        titleTa: 'தெருவிளக்கு பழுது நீக்கப்பட்டு தீர்வு காணப்பட்டது',
        messageEn: 'Complaint NCC-2026-00123 in Velachery has been resolved. Please verify the resolution photo.',
        messageTa: 'வேளச்சேரி புகார் NCC-2026-00123 தீர்க்கப்பட்டது. தீர்வு புகைப்படத்தை சரிபார்க்கவும்.',
        timestamp: '2026-09-08T16:45:00Z',
        read: false,
        type: 'success'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('namma_city_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('namma_city_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Generate unique complaint ID: NCC-2026-XXXXX
  const generateComplaintId = () => {
    const year = new Date().getFullYear();
    const existingCount = complaints.length;
    const nextNum = (125 + existingCount + 1).toString().padStart(5, '0');
    return `NCC-${year}-${nextNum}`;
  };

  // Check if duplicate exists near the coordinates (within ~350m)
  const checkDuplicate = (category, lat, lng, radiusKm = 0.35) => {
    if (!lat || !lng) return null;
    return complaints.find((item) => {
      if (item.status === 'resolved') return false; // Resolved issues are not duplicates
      if (item.category !== category) return false;
      const dist = calculateDistance(lat, lng, item.lat, item.lng);
      return dist <= radiusKm;
    });
  };

  // Add new complaint
  const addComplaint = (newIssue) => {
    const complaintId = generateComplaintId();
    const now = new Date().toISOString();

    const createdComplaint = {
      id: complaintId,
      category: newIssue.category,
      title: newIssue.title || `${newIssue.category.replace('_', ' ').toUpperCase()} Issue`,
      description: newIssue.description,
      image: newIssue.image,
      resolutionImage: null,
      address: newIssue.address || 'Chennai Urban Area',
      lat: newIssue.lat || 13.0827,
      lng: newIssue.lng || 80.2707,
      severity: newIssue.severity || 'medium',
      priority: newIssue.priority || 'medium',
      aiConfidence: newIssue.aiConfidence || 91,
      department: newIssue.department || 'municipal_corp',
      status: 'reported',
      reportedDate: now,
      expectedResolutionDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      resolvedDate: null,
      assignedOfficer: 'Pending Verification by Ward AE',
      upvotes: 1,
      hasUserUpvoted: true,
      verifiedByCitizen: false,
      sensitiveArea: newIssue.sensitiveArea || {
        nearSchool: false,
        nearHospital: false,
        mainRoad: false,
        publicSafety: false
      },
      timeline: [
        {
          status: 'reported',
          title: 'Complaint Registered',
          description: `Logged by citizen via Smart Reporting with AI classification.`,
          timestamp: now,
          actor: 'Citizen Portal'
        }
      ],
      comments: []
    };

    setComplaints((prev) => [createdComplaint, ...prev]);

    // Push notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      complaintId,
      titleEn: `Complaint ${complaintId} Registered`,
      titleTa: `புகார் ${complaintId} பதிவு செய்யப்பட்டது`,
      messageEn: `Your complaint ${complaintId} has been submitted successfully and sent to ward officials.`,
      messageTa: `உங்கள் புகார் ${complaintId} வெற்றிகரமாக சமர்ப்பிக்கப்பட்டு வார்டு அதிகாரிகளுக்கு அனுப்பப்பட்டுள்ளது.`,
      timestamp: now,
      read: false,
      type: 'info'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return createdComplaint;
  };

  // Update Status by Admin / Official
  const updateComplaintStatus = (id, newStatus, officerComment = '', resolutionImg = null, officerName = 'Er. K. Ramanathan') => {
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const isResolved = newStatus === 'resolved';
        const updatedTimeline = [
          ...c.timeline,
          {
            status: newStatus,
            title: `Status: ${newStatus.replace('_', ' ').toUpperCase()}`,
            description: officerComment || `Workflow stage transitioned to ${newStatus}.`,
            timestamp: now,
            actor: officerName
          }
        ];

        return {
          ...c,
          status: newStatus,
          resolvedDate: isResolved ? now : c.resolvedDate,
          resolutionImage: resolutionImg || c.resolutionImage,
          timeline: updatedTimeline,
          comments: officerComment
            ? [
                ...c.comments,
                {
                  id: `comm_${Date.now()}`,
                  author: officerName,
                  role: 'Official',
                  text: officerComment,
                  timestamp: now
                }
              ]
            : c.comments
        };
      })
    );

    // Add notification
    const statusTitlesEn = {
      verified: 'Complaint Verified',
      assigned: 'Department Assigned',
      in_progress: 'Work In Progress',
      resolved: 'Complaint Resolved!'
    };
    const statusTitlesTa = {
      verified: 'புகார் சரிபார்க்கப்பட்டது',
      assigned: 'துறைக்கு ஒதுக்கப்பட்டது',
      in_progress: 'பணிகள் தொடங்கப்பட்டுள்ளன',
      resolved: 'புகார் தீர்க்கப்பட்டது!'
    };

    const newNotif = {
      id: `notif_${Date.now()}`,
      complaintId: id,
      titleEn: statusTitlesEn[newStatus] || 'Complaint Updated',
      titleTa: statusTitlesTa[newStatus] || 'புகார் நிலை புதுப்பிக்கப்பட்டது',
      messageEn: `Complaint ${id} status changed to ${newStatus.toUpperCase()}. Officer note: ${officerComment || 'Work in progress'}`,
      messageTa: `புகார் ${id} நிலை மாற்றப்பட்டுள்ளது. அதிகாரி குறிப்பு: ${officerComment || 'நடவடிக்கை எடுக்கப்படுகிறது'}`,
      timestamp: now,
      read: false,
      type: newStatus === 'resolved' ? 'success' : 'info'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Assign department
  const assignDepartment = (id, departmentId, officerName = 'Ward AE', comment = '') => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          department: departmentId,
          assignedOfficer: officerName,
          status: c.status === 'reported' ? 'assigned' : c.status,
          timeline: [
            ...c.timeline,
            {
              status: 'assigned',
              title: 'Assigned to Department',
              description: `Routed to ${departmentId}. ${comment}`,
              timestamp: now,
              actor: 'Redressal Cell'
            }
          ]
        };
      })
    );
  };

  // Change priority
  const updatePriority = (id, newPriority) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, priority: newPriority } : c))
    );
  };

  // Upvote complaint
  const upvoteComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const hasUpvoted = c.hasUserUpvoted;
        return {
          ...c,
          upvotes: hasUpvoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1,
          hasUserUpvoted: !hasUpvoted
        };
      })
    );
  };

  // Citizen confirms resolution
  const verifyComplaintByCitizen = (id) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          verifiedByCitizen: true,
          timeline: [
            ...c.timeline,
            {
              status: 'resolved',
              title: 'Citizen Community Verified',
              description: 'Local citizen inspected spot and confirmed problem has been satisfactorily resolved.',
              timestamp: now,
              actor: 'Citizen Community'
            }
          ]
        };
      })
    );
  };

  // Report that issue still exists
  const reportStillExists = (id, reason = '') => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status: 'in_progress',
          priority: 'high',
          timeline: [
            ...c.timeline,
            {
              status: 'in_progress',
              title: 'Citizen Escalation: Issue Persists',
              description: reason || 'Citizen flagged that the issue still exists on ground. Priority escalated to High.',
              timestamp: now,
              actor: 'Citizen Review'
            }
          ]
        };
      })
    );
  };

  // Add comment
  const addComment = (id, text, author = 'Citizen', role = 'Citizen') => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          comments: [
            ...c.comments,
            {
              id: `comm_${Date.now()}`,
              author,
              role,
              text,
              timestamp: now
            }
          ]
        };
      })
    );
  };

  // Notification actions
  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        notifications,
        addComplaint,
        checkDuplicate,
        updateComplaintStatus,
        assignDepartment,
        updatePriority,
        upvoteComplaint,
        verifyComplaintByCitizen,
        reportStillExists,
        addComment,
        markNotificationRead,
        markAllNotificationsRead,
        calculateDistance
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
