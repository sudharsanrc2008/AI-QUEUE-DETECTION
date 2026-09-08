"""
SmartQueue AI - Real-Time YOLOv8 & OpenCV Video Processing Pipeline
Topic: AI Immersion - Smart Queue Detection

This script runs live person detection and queue counting using Ultralytics YOLOv8.
It tracks people inside defined Region of Interest (ROI) polygons and streams
live telemetry data (count, waiting times, bounding boxes) to the SmartQueue Express Backend.

Requirements:
    pip install ultralytics opencv-python requests numpy

Usage:
    python yolo_detector.py --source 0                      # Use default webcam
    python yolo_detector.py --source queue_cctv.mp4         # Use video file
    python yolo_detector.py --source rtsp://camera_ip/live  # Use IP camera RTSP feed
"""

import argparse
import time
import json
import numpy as np

try:
    import cv2
    import requests
    from ultralytics import YOLO
    DEPS_AVAILABLE = True
except ImportError:
    DEPS_AVAILABLE = False


def run_detector(source="0", backend_url="http://localhost:5000/api/detections/telemetry", queue_id="q-canteen"):
    if not DEPS_AVAILABLE:
        print("[SmartQueue AI] Note: ultralytics, opencv-python, or requests not installed in current Python environment.")
        print("[SmartQueue AI] To run live YOLOv8 on actual hardware, install:")
        print("                pip install ultralytics opencv-python requests numpy")
        print("[SmartQueue AI] Meanwhile, the web dashboard's built-in AI Simulation Engine is active.")
        return

    print(f"[SmartQueue AI] Initializing YOLOv8 Person Detector on source: {source}")
    model = YOLO("yolov8n.pt")  # Loads nano model for high FPS real-time tracking
    
    cap = cv2.VideoCapture(int(source) if source.isdigit() else source)
    if not cap.isOpened():
        print(f"[Error] Could not open video source: {source}")
        return

    # Default Queue Region of Interest (ROI) polygon: [[x1, y1], [x2, y2], ...]
    roi_polygon = np.array([[100, 150], [550, 150], [580, 680], [80, 680]], np.int32)
    person_track_history = {}

    last_telemetry_time = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("[SmartQueue AI] Video stream ended or camera disconnected.")
            break

        # Run YOLO inference with person tracking (class 0 = person)
        results = model.track(frame, persist=True, classes=[0], verbose=False)
        
        people_in_queue = 0
        detected_boxes = []

        if results and results[0].boxes and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy()
            track_ids = results[0].boxes.id.int().cpu().numpy()
            confidences = results[0].boxes.conf.cpu().numpy()

            for box, track_id, conf in zip(boxes, track_ids, confidences):
                x1, y1, x2, y2 = map(int, box)
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

                # Test if person's bottom center is within Queue ROI
                is_in_roi = cv2.pointPolygonTest(roi_polygon, (cx, y2), False) >= 0

                if is_in_roi:
                    people_in_queue += 1
                    if track_id not in person_track_history:
                        person_track_history[track_id] = time.time()
                    
                    wait_sec = int(time.time() - person_track_history[track_id])
                    
                    # Draw green bounding box for queue members
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 120), 2)
                    label = f"ID #{track_id} | Wait: {wait_sec}s | {int(conf*100)}%"
                    cv2.putText(frame, label, (x1, max(20, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 120), 2)
                    
                    detected_boxes.append({
                        "id": int(track_id),
                        "bbox": [x1, y1, x2 - x1, y2 - y1],
                        "wait_time_sec": wait_sec,
                        "conf": round(float(conf), 2)
                    })
                else:
                    # Draw blue bounding box for passersby outside queue
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 180, 0), 1)

        # Draw ROI polygon outline
        cv2.polylines(frame, [roi_polygon], isClosed=True, color=(0, 200, 255), thickness=2)
        cv2.putText(frame, f"QUEUE ZONE ROI [Count: {people_in_queue}]", (roi_polygon[0][0], roi_polygon[0][1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 200, 255), 2)

        # Send telemetry to Express Backend every 1 second
        if time.time() - last_telemetry_time >= 1.0:
            last_telemetry_time = time.time()
            try:
                payload = {
                    "queue_id": queue_id,
                    "people_count": people_in_queue,
                    "confidence": 95.8,
                    "tracked_objects": detected_boxes
                }
                requests.post(backend_url, json=payload, timeout=0.8)
            except Exception as e:
                pass  # Avoid halting on network drops

        # Overlay HUD
        cv2.putText(frame, f"SmartQueue AI | Queue: {people_in_queue} people", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        cv2.imshow("SmartQueue AI - Live Vision Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SmartQueue AI - YOLOv8 Live Inference")
    parser.add_argument("--source", default="0", help="Webcam index 0 or path to video file")
    parser.add_argument("--queue", default="q-canteen", help="Queue ID matching backend")
    parser.add_argument("--url", default="http://localhost:5000/api/detections/telemetry", help="Backend telemetry endpoint")
    args = parser.parse_args()

    run_detector(source=args.source, backend_url=args.url, queue_id=args.queue)
