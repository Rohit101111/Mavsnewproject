import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, ShieldAlert, HeartPulse, Building, Eye, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Laptop, Settings, Layers, Box } from 'lucide-react';

export default function Verticals({ setActivePage, selectedVerticalId, setSelectedVerticalId }) {
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  


  const verticalsData = [
    {
      id: 'corporate',
      title: 'Corporate Enterprises',
      subtitle: 'Hybrid Collaboration & Workplace Experiences',
      imagePath: '/images/corporate.png',
      desc: 'Empower hybrid teams with seamless conference systems, room scheduling panels, and high-impact digital workspaces that foster innovation and connection.',
      longDesc: 'Modern corporate spaces demand frictionless collaboration between in-office and remote personnel. MAVS engineers reliable corporate environments utilizing top-tier technologies from Logitech, Poly, Yealink, and Barco. We align with your IT policies to deploy secure, cloud-manageable meeting rooms that work seamlessly with Microsoft Teams, Zoom, and Webex systems.',
      icon: <Building2 size={24} style={{ color: 'var(--color-primary)' }} />,
      spaces: [
        { 
          id: 'huddle_rooms',
          name: 'Huddle Room', 
          tech: 'A huddle room is designed for 4–5 people, transforming small spaces into productive environments for collaboration, communication, and seamless idea sharing.',
          image: '/images/space_huddle.png',
          advantages: [
            'Commercial display enhances engagement and real-time collaboration.',
            'Integrated video bar provides high-quality conferencing experiences.',
            'Delivers clear audio and video for effective communication.',
            'Enables seamless collaboration between in-room and remote participants.',
            'Supports wireless content sharing for efficient meetings.'
          ],
          useCases: [
            'Accommodates small team meetings of 4–5 people.',
            'Supports quick discussions and impromptu gatherings.',
            'Encourages collaboration in a compact environment.',
            'Ideal for daily stand-ups and project updates.',
            'Facilitates brainstorming and idea-sharing sessions.',
            'Enables private discussions away from open workspaces.',
            'Maximizes efficient utilization of office space.'
          ],
          gallery: [
            { name: 'Room View', path: '/images/space_huddle.png' },
            { name: 'Smart Video Bar', path: '/images/huddle_detail_bar.png' },
            { name: 'Tabletop Controller', path: '/images/huddle_detail_table.png' }
          ],
          hardware: 'Logitech MeetUp, Poly Studio R30, Yealink MeetingBar A10, Barco ClickShare CX-20.'
        },
        { 
          id: 'collaboration_rooms',
          name: 'Collaboration Room', 
          tech: 'A collaboration room transforms meeting spaces into interactive environments that promote creativity, knowledge sharing, and productive team engagement.',
          image: '/images/space_collaboration.png',
          advantages: [
            'Interactive display enables dynamic brainstorming and team collaboration.',
            'Integrated BYOD video conferencing provides high-quality conferencing experiences.',
            'Enhances engagement through interactive and collaborative experiences.',
            'Facilitates seamless communication among team members and participants.',
            'Supports productive discussions, innovation, and faster decision-making.'
          ],
          useCases: [
            'Supports brainstorming and creative problem-solving sessions.',
            'Encourages teamwork and cross-functional collaboration.',
            'Facilitates project planning and strategy discussions.',
            'Enables interactive workshops and group activities.',
            'Promotes knowledge sharing among team members.',
            'Supports collaborative decision-making and innovation.',
            'Creates an engaging environment for productive teamwork.'
          ],
          gallery: [
            { name: 'Room View', path: '/images/space_collaboration.png' },
            { name: 'Interactive Display', path: '/images/collab_detail_panel.png' },
            { name: 'Table Connection Hub', path: '/images/collab_detail_hub.png' }
          ],
          hardware: 'Newline Q Series Touch, LG TR3DK Interactive Board, Barco ClickShare CX-30, Shure Stem Audio.'
        },
        { 
          id: 'conference_rooms',
          name: 'Conference Room', 
          tech: 'A conference room transforms meeting spaces into productive environments that support discussions, presentations, collaboration, and informed decision-making.',
          image: '/images/space_conference.png',
          advantages: [
            'Professional display system delivers clear and impactful presentations.',
            'Advanced conferencing solution ensures seamless hybrid meetings.',
            'Enhances communication between in-room and remote participants.',
            'Supports efficient content sharing and collaborative discussions.',
            'Enables productive meetings and informed decision-making.'
          ],
          useCases: [
            'Hosts formal meetings and business discussions.',
            'Supports presentations and information sharing.',
            'Facilitates team alignment and project reviews.',
            'Enables client meetings and stakeholder engagements.',
            'Provides space for training and knowledge sessions.',
            'Supports collaborative planning and decision-making.',
            'Creates a professional environment for productive meetings.'
          ],
          gallery: [
            { name: 'Room View', path: '/images/space_conference.png' },
            { name: 'Ceiling Mic Array', path: '/images/conf_detail_mic.png' },
            { name: 'Tabletop Touch Controller', path: '/images/space_detail_panel.png' }
          ],
          hardware: 'Logitech Rally Plus System, Yealink MVC840 Kit, QSC Q-SYS Core Nano, Shure MXA920 Ceiling Mic.'
        },
        { 
          id: 'boardrooms',
          name: 'Boardroom & Executive Suite', 
          tech: 'Boardrooms and executive rooms create sophisticated spaces for executive meetings, confidential discussions, strategic planning, and organizational decision-making',
          image: '/images/space_boardroom.png',
          advantages: [
            'Premium display solution delivers impactful executive presentations.',
            'Advanced conferencing system supports seamless leadership meetings.',
            'Ensures clear communication during strategic discussions.',
            'Enhances collaboration between executives and remote participants.',
            'Supports confidential, efficient, and informed decision-making.'
          ],
          useCases: [
            'Hosts leadership meetings and strategic discussions.',
            'Supports executive planning and decision-making.',
            'Facilitates confidential business conversations.',
            'Provides space for high-level client meetings.',
            'Enables corporate governance and board reviews.',
            'Supports business planning and performance evaluations.',
            'Creates a premium environment for executive engagement.'
          ],
          hardware: 'Poly Studio X70, QSC TSC-101-G3 Panel, Shure MXA902 Mic, LG UltraHD Signage, Kramer Matrix VS-88UT.'
        },
        { 
          id: 'training_rooms',
          name: 'Training Room & Multipurpose Room', 
          tech: 'A training and multipurpose room transforms educational spaces into flexible learning environments that support presentations, employee onboarding, hands-on workshops, and knowledge sharing.',
          image: '/images/space_training.png',
          advantages: [
            'Large-format display delivers clear and engaging visual content.',
            'Flexible AV system supports training, presentations, and events.',
            'Enhances participant engagement through interactive learning experiences.',
            'Adapts easily to different room layouts and use cases.',
            'Supports effective knowledge sharing and group collaboration.'
          ],
          useCases: [
            'Supports employee training and skill development programs.',
            'Facilitates workshops, seminars, and learning sessions.',
            'Accommodates team meetings and group activities.',
            'Enables flexible room configurations for diverse needs.',
            'Supports corporate events and internal presentations.',
            'Provides space for collaborative and interactive sessions.',
            'Maximizes utilization through multi-functional room usage.'
          ],
          hardware: 'Barco G62 Laser Projector, QSC CX-Q Amplifier, Shure SLXD Wireless Mics, Kramer Scalers.'
        },
        { 
          id: 'operating_centers',
          name: 'Operating Centers', 
          tech: 'An operating center transforms control rooms into secure, high-visibility monitoring environments that support 24/7 data visualization, situational awareness, and critical decision-making.',
          image: '/images/space_operations.png',
          advantages: [
            'Large video wall provides centralized operational visibility.',
            'Advanced monitoring systems enable real-time information display.',
            'Enhances situational awareness and decision-making efficiency.',
            'Improves coordination across teams and operational functions.',
            'Supports continuous monitoring of critical business activities.'
          ],
          useCases: [
            'Supports continuous monitoring of critical operations.',
            'Enables centralized management of business activities.',
            'Facilitates real-time information review and coordination.',
            'Supports incident response and operational oversight.',
            'Enhances communication across teams and departments.',
            'Provides visibility into key performance metrics.',
            'Creates a dedicated environment for operational control.'
          ],
          hardware: 'LG VM5J Bezel Video Wall, Kramer KDS-7 Transceivers, QSC Q-SYS Core 610, custom console racks.'
        },
        { 
          id: 'reception',
          name: 'Reception Area', 
          tech: 'A reception area transforms entrances into engaging spaces that welcome visitors, showcase brand identity, and facilitate communication.',
          image: '/images/space_reception.png',
          advantages: [
            'Digital signage enhances visitor engagement and communication.',
            'Professional display solutions reinforce corporate branding.',
            'Delivers dynamic content for announcements and information.',
            'Creates a modern and welcoming visitor experience.',
            'Improves communication and information accessibility for guests.'
          ],
          useCases: [
            'Creates a welcoming first impression for visitors.',
            'Supports guest registration and visitor management.',
            'Facilitates employee and visitor interactions.',
            'Provides a comfortable waiting environment.',
            'Reinforces corporate branding and company identity.',
            'Serves as a central point for information assistance.',
            'Enhances overall visitor experience and engagement.'
          ],
          hardware: 'LG Commercial Signage, QSC AcousticDesign Ceiling Speakers, Kramer Active HDMI Extenders.'
        },
        { 
          id: 'cafeteria',
          name: 'Cafeteria & Townhall', 
          tech: 'A cafeteria provides a comfortable environment for employees to relax, connect, collaborate informally, and recharge throughout the day.',
          image: '/images/space_cafeteria.png',
          advantages: [
            'Large-format displays support townhall meetings and presentations.',
            'Audio systems ensure clear communication across larger audiences.',
            'Delivers company updates, announcements, and employee communications.',
            'Creates an engaging space for collaboration and social interaction.',
            'Supports employee engagement, events, and organizational gatherings.'
          ],
          useCases: [
            'Provides a comfortable space for employee breaks.',
            'Encourages informal interactions and team bonding.',
            'Supports dining and refreshment activities.',
            'Promotes employee well-being and workplace satisfaction.',
            'Facilitates casual discussions and idea exchange.',
            'Serves as a social hub within the workplace.',
            'Creates a relaxing environment for recharging.'
          ],
          hardware: 'QSC AD-P4T Pendant Speakers, Barco Projectors, LG Signage Display boards, Shure Wireless Handheld Mics.'
        },
        { 
          id: 'signage',
          name: 'Workspace Scheduling & Signage', 
          tech: 'Workspace scheduling and signage solutions optimize space utilization, simplify room bookings, and provide real-time availability for seamless workplace experiences.',
          image: '/images/space_signage.png',
          advantages: [
            'Room scheduling panels simplify meeting space reservations.',
            'Digital signage provides real-time room availability information.',
            'Improves workplace efficiency through optimized space utilization.',
            'Reduces scheduling conflicts and booking uncertainties.',
            'Enhances employee experience with streamlined workspace management.'
          ],
          useCases: [
            'Simplifies meeting room booking and scheduling.',
            'Displays real-time room availability information.',
            'Optimizes utilization of workplace resources.',
            'Reduces scheduling conflicts and booking errors.',
            'Supports efficient space management across facilities.',
            'Enhances workplace navigation and room identification.',
            'Improves employee experience through streamlined scheduling.'
          ],
          hardware: 'Yealink RoomPanel, Logitech Tap Scheduler, custom PoE cabling infrastructure.'
        }
      ],
      benefits: [
        'Streamlined client and remote partner collaboration',
        'Drastic reduction in meeting setup and troubleshooting times',
        'Centralized enterprise AV management and cloud monitoring',
        'Elegant architectural integration preserving room aesthetics'
      ]
    },
    {
      id: 'education',
      title: 'Education & Training',
      subtitle: 'Active Learning & Lecture Capture Solutions',
      imagePath: '/images/education.png',
      desc: 'Transform traditional learning spaces into interactive, digital-ready classrooms and lecture halls to foster student engagement and collaborative learning.',
      longDesc: 'Next-generation classrooms require interactive, easy-to-use platforms that support both in-person students and remote participants. We design active learning spaces combining Newline interactive screens, Yealink room panels, and professional QSC audio DSPs to ensure pristine speech intelligibility and dynamic classroom interactions.',
      icon: <GraduationCap size={24} style={{ color: 'var(--color-secondary)' }} />,
      spaces: [
        { 
          id: 'smart_classrooms',
          name: 'Hybrid Smart Classrooms', 
          tech: 'A hybrid smart classroom combines interactive learning technologies and seamless connectivity to deliver engaging educational experiences for in-person and remote students.',
          image: '/images/education.png',
          advantages: [
            'Interactive displays enhance teaching and student engagement.',
            'Integrated camera and audio systems support hybrid learning.',
            'Delivers a consistent experience for remote and in-person learners.',
            'Improves collaboration, participation, and knowledge retention.',
            'Enables flexible, scalable, and future-ready learning environments.'
          ],
          useCases: [
            'Supports simultaneous in-person and remote learning.',
            'Enables interactive teaching and student participation.',
            'Facilitates real-time content sharing and collaboration.',
            'Supports lectures, workshops, and training sessions.',
            'Enhances engagement through digital learning tools.',
            'Enables recording and playback of classroom sessions.',
            'Creates a flexible and inclusive learning environment.'
          ],
          gallery: [
            { name: 'Classroom View', path: '/images/education.png' }
          ],
          hardware: 'Newline interactive panels, Logitech PTZ cameras.'
        },
        { 
          id: 'lecture_halls',
          name: 'Auditoriums & Lecture Halls', 
          tech: 'Auditoriums and lecture halls provide engaging environments for large audiences, supporting presentations, lectures, events, and effective knowledge sharing.',
          image: '/images/space_lecture_hall.png',
          advantages: [
            'Large-format displays deliver impactful visual presentations.',
            'Professional audio systems ensure clear audience coverage.',
            'Enhances engagement during lectures, events, and presentations.',
            'Supports seamless communication with large audiences.',
            'Creates an immersive and professional presentation environment.'
          ],
          useCases: [
            'Supports large-scale presentations and keynote sessions.',
            'Facilitates lectures, seminars, and educational programs.',
            'Enables corporate events and company-wide communications.',
            'Accommodates training sessions and knowledge-sharing initiatives.',
            'Supports panel discussions and guest speaker events.',
            'Provides a venue for cultural and community activities.',
            'Creates an engaging environment for large audiences.'
          ],
          hardware: 'Barco laser projectors, QSC amplifiers.'
        },
        { 
          id: 'digital_library',
          name: 'Digital Library', 
          tech: 'A digital library provides centralized access to educational resources, enabling research, self-learning, and collaborative knowledge sharing anytime.',
          image: '/images/space_digital_library.png',
          advantages: [
            'Interactive displays enhance access to digital content.',
            'Digital catalog systems simplify resource search and navigation.',
            'Expands access to educational and reference materials.',
            'Supports engaging, flexible, and self-directed learning.',
            'Enables efficient management and utilization of learning resources.'
          ],
          useCases: [
            'Provides access to digital books and learning resources.',
            'Supports self-paced learning and academic research.',
            'Enables content discovery across multiple subjects.',
            'Facilitates collaborative and independent study activities.',
            'Offers centralized access to educational materials.',
            'Supports multimedia-based learning experiences.',
            'Creates a modern and technology-enabled learning environment.'
          ],
          hardware: 'Newline touch screen terminals, LG digital kiosks, high-speed networking switches.'
        },
        { 
          id: 'digital_signage',
          name: 'Digital Signage', 
          tech: 'Digital signage delivers real-time information, announcements, wayfinding, and educational content, enhancing communication and engagement across campus.',
          image: '/images/space_campus_signage.png',
          advantages: [
            'Professional displays deliver dynamic and engaging content.',
            'Centralized content management simplifies information distribution.',
            'Enables real-time communication across the campus.',
            'Enhances student engagement and information accessibility.',
            'Improves operational efficiency and campus communication.'
          ],
          useCases: [
            'Displays campus announcements and important updates.',
            'Provides wayfinding and navigation across facilities.',
            'Communicates event schedules and academic information.',
            'Shares emergency alerts and safety notifications.',
            'Promotes student activities and campus initiatives.',
            'Displays educational content and awareness campaigns.',
            'Enhances communication across the institution.'
          ],
          hardware: 'LG Commercial displays, custom digital signage players, centralized CMS software.'
        },
        { 
          id: 'collaborative_learning',
          name: 'Collaborative Learning Spaces', 
          tech: 'Collaborative learning spaces foster teamwork, creativity, and active participation, enabling students to engage, share ideas, and learn together.',
          image: '/images/space_collab_learning.png',
          advantages: [
            'Interactive displays enhance student engagement and participation.',
            'Collaboration tools support seamless content sharing and teamwork.',
            'Encourages active learning and knowledge retention.',
            'Improves communication between students and educators.',
            'Creates dynamic, flexible, and student-centric learning environments.'
          ],
          useCases: [
            'Supports group discussions and collaborative learning activities.',
            'Encourages teamwork and peer-to-peer knowledge sharing.',
            'Facilitates project-based and interactive learning sessions.',
            'Enables brainstorming and creative problem-solving exercises.',
            'Supports workshops and collaborative classroom activities.',
            'Promotes active student participation and engagement.',
            'Creates flexible environments for diverse learning styles.'
          ],
          hardware: 'Newline interactive boards, QSC pendant speakers, Barco ClickShare collaboration pod setups.'
        }
      ],
      benefits: [
        'Increased student engagement and visual information retention',
        'Flawless support for hybrid classes and lecture capture archiving',
        'Unified campus communication and paging distribution'
      ]
    },
    {
      id: 'government',
      title: 'Government & Control Centers',
      subtitle: 'Mission-Critical Visualizations & Secure AV Networks',
      imagePath: '/images/government.jpg',
      desc: 'Secure, low-latency, and highly reliable control room installations designed for 24/7 operations, monitoring centers, and legislative auditoriums.',
      longDesc: 'For mission-critical command centers, security operations, and legislative assemblies, system uptime and data security are paramount. We architect rugged, redundant visual layouts utilizing LG ultra-narrow bezel displays, Kramer IP signal extenders, and specialized matrix processors to deliver lag-free situational awareness.',
      icon: <ShieldAlert size={24} style={{ color: 'var(--color-accent)' }} />,
      spaces: [
        { 
          id: 'noc_centers',
          name: 'Network Operations Centers (NOC)', 
          tech: 'Centralized high-reliability video walls, real-time diagnostic systems, and AV-over-IP matrix routing.',
          image: '/images/space_operations.png',
          advantages: [
            'High-reliability 24/7 video walls deliver uninterrupted operational awareness.',
            'AV-over-IP distribution supports scalable multi-source routing.',
            'Ultra-narrow bezel displays ensure a seamless, unified visualization canvas.',
            'Real-time diagnostic overlays assist in immediate issue identification.',
            'Centralized control matrix simplifies management for operators.'
          ],
          useCases: [
            'Supports continuous monitoring of IT networks and infrastructure.',
            'Facilitates municipal operations and smart city monitoring.',
            'Enables high-security surveillance and access coordination.',
            'Coordinates emergency response and disaster management teams.',
            'Monitors traffic control and transit network operations.',
            'Tracks utility grids and critical industrial systems.',
            'Provides a centralized hub for cross-departmental coordination.'
          ],
          hardware: 'LG narrow-bezel video walls, Kramer IP encoders, QSC audio processing, secure console terminals.'
        },
        { 
          id: 'gov_conference_rooms',
          name: 'Conference Rooms', 
          tech: 'Conference rooms provide a professional environment for government meetings, policy discussions, inter-departmental coordination, and effective decision-making.',
          image: '/images/space_gov_conference.png',
          advantages: [
            'Professional displays support effective information presentation.',
            'Video conferencing enables collaboration across locations.',
            'Enhances communication between departments and officials.',
            'Improves efficiency in meetings and decision-making.',
            'Supports seamless coordination and governance activities.'
          ],
          useCases: [
            'Supports inter-departmental meetings and discussions.',
            'Facilitates policy review and planning sessions.',
            'Enables stakeholder consultations and project reviews.',
            'Supports administrative and governance activities.',
            'Conducts virtual meetings with regional offices.',
            'Facilitates decision-making and coordination meetings.',
            'Provides a professional environment for official discussions.'
          ],
          hardware: 'Logitech Rally Plus, Shure ceiling mic array, LG Commercial display, Barco ClickShare.'
        },
        { 
          id: 'gov_training_rooms',
          name: 'Training Rooms', 
          tech: 'Training rooms support skill development, capacity building, workshops, and knowledge-sharing programs for government employees and officials.',
          image: '/images/space_gov_training.png',
          advantages: [
            'Interactive displays enhance learning and engagement.',
            'Flexible AV solutions support diverse training formats.',
            'Improves knowledge retention and participant interaction.',
            'Enables effective delivery of training programs.',
            'Supports scalable and future-ready learning environments.'
          ],
          useCases: [
            'Supports employee training and capacity-building programs.',
            'Facilitates workshops and skill development sessions.',
            'Conducts orientation and induction programs.',
            'Supports policy awareness and compliance training.',
            'Enables knowledge-sharing and professional development.',
            'Accommodates departmental learning initiatives.',
            'Provides a dedicated environment for continuous learning.'
          ],
          hardware: 'Newline interactive boards, QSC pendant speakers, Barco ClickShare collaboration pod setups.'
        },
        { 
          id: 'gov_auditorium',
          name: 'Auditorium', 
          tech: 'Auditoriums provide a venue for government events, public outreach programs, seminars, large-scale training, and official gatherings.',
          image: '/images/space_gov_auditorium.png',
          advantages: [
            'Large-format displays deliver impactful visual presentations.',
            'Professional audio systems ensure clear audience communication.',
            'Enhances engagement during public and official events.',
            'Supports seamless communication with large audiences.',
            'Creates a professional environment for government programs.'
          ],
          useCases: [
            'Hosts public meetings and government events.',
            'Facilitates conferences, seminars, and awareness programs.',
            'Supports official ceremonies and recognition events.',
            'Conducts large-scale training and educational sessions.',
            'Enables stakeholder engagement and public outreach.',
            'Accommodates cultural and community programs.',
            'Provides a venue for large audience gatherings.'
          ],
          hardware: 'Barco laser projectors, QSC amplifiers, Shure wireless mic system.'
        }
      ],
      benefits: [
        'Zero-latency visual routing for instantaneous data monitoring',
        '24/7 continuous duty stability with failover redundancy',
        'Strict isolation of secure government networks'
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare Facilities',
      subtitle: 'Clinical Collaboration & Patient Care Audio-Visuals',
      imagePath: '/images/healthcare.png',
      desc: 'Bespoke visual communication, patient monitoring dashboard integration, digital wayfinding displays, and surgical suite AV routing.',
      longDesc: 'Modern healthcare facilities require clean, highly integrated visual systems to support clinical decisions, diagnostics, and patient communications. MAVS designs fully customizable AV systems that prioritize hygiene, reliability, and security in medical environments. We deploy high-resolution display matrices, clinical audio distribution, and remote consulting PTZ systems that comply with healthcare IT protocols.',
      icon: <HeartPulse size={24} style={{ color: 'var(--color-accent)' }} />,
      spaces: [
        { 
          id: 'medical_systems_integration',
          name: 'Medical Systems Integration', 
          tech: 'Medical systems integration connects clinical technologies and information systems, enabling streamlined workflows, efficient operations, and improved patient care.',
          image: '/images/space_healthcare_integration.png',
          advantages: [
            'Centralized systems improve access to critical information.',
            'Enhances collaboration between clinical departments.',
            'Streamlines workflows and reduces operational complexity.',
            'Improves efficiency in patient care delivery.',
            'Supports informed and timely clinical decision-making.'
          ],
          useCases: [
            'Integrates multiple medical systems into a unified platform.',
            'Enables centralized monitoring of clinical information.',
            'Facilitates seamless access to patient data.',
            'Supports coordination between departments and caregivers.',
            'Streamlines clinical workflows and information sharing.',
            'Enhances operational efficiency across healthcare facilities.',
            'Improves collaboration among healthcare professionals.'
          ],
          hardware: 'Clinical grade display terminals, medical system gateway interfaces, secure database bridges.'
        },
        { 
          id: 'operating_room_integrations',
          name: 'Operating Room Integrations (OT)', 
          tech: 'Operating room integration unifies surgical technologies and clinical systems, enhancing workflow efficiency, coordination, and information accessibility.',
          image: '/images/space_healthcare_ot.png',
          advantages: [
            'Integrated systems improve surgical workflow efficiency.',
            'Enables seamless access to critical surgical information.',
            'Enhances communication among surgical team members.',
            'Supports improved coordination during procedures.',
            'Optimizes operating room utilization and productivity.'
          ],
          useCases: [
            'Integrates surgical equipment and clinical systems.',
            'Supports centralized management of operating room workflows.',
            'Enables real-time access to surgical information.',
            'Facilitates collaboration among surgical teams.',
            'Supports procedure documentation and information sharing.',
            'Enhances operational coordination during surgeries.',
            'Streamlines communication within operating environments.'
          ],
          hardware: 'Clinical displays, zero-latency fiber-optic matrix routing, suspended HD cameras, surgical control panels.'
        },
        { 
          id: 'patient_experience_wayfinding',
          name: 'Patient Experience & Wayfinding', 
          tech: 'Patient experience and wayfinding solutions simplify navigation, improve accessibility, and create seamless healthcare journeys for patients and visitors.',
          image: '/images/space_healthcare_wayfinding.png',
          advantages: [
            'Interactive wayfinding solutions simplify navigation.',
            'Reduces patient stress and navigation challenges.',
            'Improves visitor satisfaction and convenience.',
            'Enhances accessibility across healthcare facilities.',
            'Supports a seamless and positive patient experience.'
          ],
          useCases: [
            'Provides intuitive navigation across healthcare facilities.',
            'Guides patients and visitors to destinations.',
            'Supports appointment and service location assistance.',
            'Reduces confusion in large healthcare campuses.',
            'Improves visitor accessibility and convenience.',
            'Facilitates efficient movement throughout facilities.',
            'Enhances overall patient and visitor experience.'
          ],
          hardware: 'LG interactive touchscreen kiosks, outdoor signage displays, localized audio announcements.'
        },
        { 
          id: 'digital_signage_queue_management',
          name: 'Digital Signage & Queue Management', 
          tech: 'Digital signage and queue management solutions streamline patient flow, improve communication, and enhance waiting area experiences.',
          image: '/images/space_healthcare_queue.png',
          advantages: [
            'Digital displays provide real-time patient information.',
            'Queue management systems improve service efficiency.',
            'Reduces waiting area congestion and confusion.',
            'Enhances patient communication and engagement.',
            'Improves overall operational efficiency and patient satisfaction.'
          ],
          useCases: [
            'Displays patient information and service updates.',
            'Manages patient queues and waiting areas.',
            'Provides real-time appointment and scheduling information.',
            'Communicates health awareness and educational content.',
            'Supports visitor guidance and information dissemination.',
            'Reduces perceived waiting times for patients.',
            'Enhances communication throughout healthcare facilities.'
          ],
          hardware: 'LG commercial display panels, token display terminals, centralized queue management players, background paging speakers.'
        }
      ],
      benefits: [
        'Pristine, clinical-grade imaging accuracy for diagnostics support',
        'Frictionless tele-consulting capabilities across departments',
        'Enhanced patient wayfinding and visual comfort in waiting lounges'
      ]
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Venues',
      subtitle: 'Smart Guest Room Automation & Lounge Audio Networks',
      imagePath: '/images/hospitality.png',
      desc: 'Distributed audio speaker networks, hotel room automation, commercial menu signage, and ballroom AV control hubs.',
      longDesc: 'Creating a premium guest experience requires seamless sensory control. MAVS designs intelligent hospitality AV systems including automated lighting, centralized multi-room background audio networks, and high-brightness digital signage boards for lounges, hotel rooms, and dining spaces. Our designs blend visually into your architectural aesthetics while offering robust administrative controls.',
      icon: <Building size={24} style={{ color: 'var(--color-secondary)' }} />,
      spaces: [
        { 
          id: 'lobby_networks',
          name: 'Lobby & Signage Networks', 
          tech: 'Vibrant digital displays for menus, announcements, and background music arrays.',
          image: '/images/space_hospitality_lobby.png',
          advantages: [
            'High-brightness digital displays present clean, eye-catching menus and promotions.',
            'Centralized management simplifies updating announcements across multiple lobbies.',
            'Balanced ambient audio networks enhance visitor reception comfort.',
            'Commercial-grade components ensure durable 24/7 signage operation.',
            'Elegant architectural integration blends screens seamlessly into hotel interior design.'
          ],
          useCases: [
            'Displays welcome information and announcements for hotel guests.',
            'Showcases restaurant menus and daily food/beverage specials dynamically.',
            'Plays curated ambient background music in lounge and lobby zones.',
            'Displays navigation paths, event schedules, and local area recommendations.',
            'Broadcasts critical emergency updates and safety announcements.',
            'Manages guest check-in queue information at front desks.',
            'Promotes corporate brand identity and premium service packages.'
          ],
          hardware: 'LG high-brightness commercial screens, localized network audio player nodes, architectural ceiling speakers.'
        },
        { 
          id: 'grand_ballrooms',
          name: 'Grand Ballrooms & Event Spaces', 
          tech: 'High-performance sound reinforcement, laser projection, and flexible input matrices.',
          image: '/images/space_hospitality_ballroom.png',
          advantages: [
            'Professional line array speaker systems ensure uniform acoustic coverage and pristine speech clarity.',
            'High-lumen laser projectors deliver vibrant visual displays in bright ambient light.',
            'Modular AV matrices enable flexible input configurations for diverse events.',
            'Touch-screen control panels make managing audio levels and lighting states simple.',
            'Wireless microphone networks support clutter-free stage presentations and panels.'
          ],
          useCases: [
            'Hosts grand corporate keynote speeches and company conferences.',
            'Facilitates large-scale banquets, wedding receptions, and gala dinners.',
            'Supports live musical performances and theatrical events with professional sound.',
            'Accommodates multi-screen panel discussions and interactive meetings.',
            'Integrates dynamic colored stage lighting systems with event cues.',
            'Supports press briefings, product launches, and media presentations.',
            'Delivers high-definition video projection for ceremonies and visual showcases.'
          ],
          hardware: 'QSC line array speakers, Barco high-lumen laser projector, Shure wireless microphones, Crestron/Kramer control interfaces.'
        },
        { 
          id: 'restaurants_bars',
          name: 'Restaurants and Bars', 
          tech: 'Acoustic zoning, high-resolution menu displays, and integrated AV controls create dining atmospheres that enhance customer engagement.',
          image: '/images/space_hospitality_restaurant.png',
          advantages: [
            'Multi-zone audio routing adjusts background volumes dynamically.',
            'High-brightness commercial displays resist screen glare from sunlight.',
            'Central control panels simplify volume and source changes.',
            'Weatherproof outdoor displays extend visuals to patio dining.',
            'Seamless architectural integrations preserve the restaurant\'s aesthetic.'
          ],
          useCases: [
            'Supports ambient background music across multiple dining zones.',
            'Displays digital menus and high-definition promotional media.',
            'Facilitates live sports broadcasts and entertainment viewing.',
            'Enables private dining room video conferencing setups.',
            'Manages localized zone volume controls for staff.',
            'Delivers clear voice announcement paging systems.',
            'Supports weekend live music or DJ performance audio feeds.'
          ],
          hardware: 'LG commercial displays, multi-channel zone amplifiers, pendant speaker lines, user-friendly control touchpads.'
        },
        { 
          id: 'hospitality_lounge',
          name: 'Lounge', 
          tech: 'Sophisticated audio zoning, warm ambient lighting integration, and low-profile visual elements establish relaxing environments for guest comfort.',
          image: '/images/space_hospitality_lounge.png',
          advantages: [
            'Low-profile speaker arrays remain visually unobtrusive.',
            'Dynamic lighting controls establish relaxed, warm atmospheres.',
            'Multi-source audio matrix allows different content in VIP areas.',
            'User-friendly tablets allow staff to manage ambient levels easily.',
            'High-fidelity acoustic design limits sound bleed to hallways.'
          ],
          useCases: [
            'Plays low-tempo ambient music arrays in seating zones.',
            'Displays soft branding visual art loops on screens.',
            'Supports private corporate events and client meetups.',
            'Integrates control panels for guest lighting adjustments.',
            'Broadcasts gentle paging announcements to specific zones.',
            'Enables screen casting for small-scale presentations.',
            'Supports acoustic performance inputs on demand.'
          ],
          hardware: 'Architectural design speakers, multi-source digital audio matrices, smart dimmer control hubs, wall control touchpads.'
        },
        { 
          id: 'hospitality_guest_room',
          name: 'Guest Room', 
          tech: 'Integrated guest room automation, smart mirroring displays, and intuitive environment touchpads deliver seamless luxury hospitality experiences.',
          image: '/images/space_hospitality_room.jpg',
          advantages: [
            'Bedside touch panels make managing lighting, climate, and TV simple for guests.',
            'Wireless media casting lets guests cast personal content to screens securely.',
            'Customizable welcome overlays project hotel announcements and room details.',
            'Automated master power systems save hotel energy when rooms are unoccupied.',
            'Reliable in-room integration reduces guest service calls and room downtime.'
          ],
          useCases: [
            'Supports smart TV media casting and mobile mirroring for guests.',
            'Integrates automated bedside panels for lighting and shade controls.',
            'Facilitates high-fidelity background audio streaming in rooms.',
            'Enables voice-activated assistant integration for hotel services.',
            'Delivers customized check-in welcome messages and hotel information.',
            'Manages smart thermostat controls for personalized climates.',
            'Supports centralized master switch overlays for energy savings.'
          ],
          hardware: 'LG commercial guest TVs, room control bedside touch panels, in-ceiling premium speakers, localized gateway processors.'
        }
      ],
      benefits: [
        'Dynamic visual marketing and ambient signage upgrades',
        'Intuitive spatial acoustic zoning for multiple dining/lounge areas',
        'Architectural integration that keeps gear hidden from guests'
      ]
    },
    {
      id: 'experience_center',
      title: 'Experience Centers',
      subtitle: 'Immersive Technology Showrooms & Experiential Visuals',
      imagePath: '/images/experience.jpg',
      desc: 'Immersive simulation projections, interactive display kiosks, and active museum exhibition visual networks.',
      longDesc: 'Experience centers represent the peak of sensory technology. We design interactive, immersive environments that engage visitors through projection mapping, touch screen kiosks, spatial sound design, and custom central control tablets. Our custom-architected installations are built for durability and continuous high-intensity use.',
      icon: <Eye size={24} style={{ color: 'var(--color-blue)' }} />,
      spaces: [
        { 
          id: 'immersive_showrooms',
          name: 'Immersive Showrooms', 
          tech: 'Multi-screen visual systems and interactive touch table controls.',
          image: '/images/space_experience_showroom.png',
          advantages: [
            'Premium curved LED screens draw visitors into high-impact visual showcases.',
            'Multi-touch interactive tables enable engaging, hands-on catalog browsing.',
            'Seamless centralized control tablets allow sales reps to trigger custom media flows.',
            'Spatial audio distribution enhances brand story delivery.',
            'Custom lighting control integrates visual media cues with room ambience.'
          ],
          useCases: [
            'Hosts corporate client brand showcase tours and walkthroughs.',
            'Presents interactive product demos and architectural walkthroughs.',
            'Provides simulation environments for training and testing.',
            'Hosts high-value retail customer experience tours.',
            'Supports real-time data visualization and interactive analytics reviews.',
            'Delivers media-rich promotional videos and dynamic corporate histories.',
            'Provides a wow-factor presentation space for VIP guest arrivals.'
          ],
          hardware: 'Direct-view LED screens, multi-touch interactive tables, media server controllers, spatial audio processing.'
        },
        { 
          id: 'museum_galleries',
          name: 'Museum & Galleries', 
          tech: 'Directional audio speakers, ambient lighting control, and display projections.',
          image: '/images/space_experience_museum.png',
          advantages: [
            'Directional audio dome speakers focus sound to prevent cross-exhibition acoustic bleed.',
            'High-precision spot lighting highlights specific artwork and historical displays.',
            'Automated projection mapping transforms plain surfaces into interactive canvases.',
            'Commercial-grade touch tablets act as durable interactive guides.',
            'Low-profile hardware integration maintains architectural and artistic aesthetics.'
          ],
          useCases: [
            'Projects historical details and animations onto museum exhibits.',
            'Playback localized descriptive narration for gallery artwork.',
            'Guides visitors through self-paced interactive exhibition maps.',
            'Showcases digital art and multimedia installations.',
            'Delivers educational video modules for tour groups.',
            'Broadcasts general announcements and schedule details to guests.',
            'Integrates background music arrays to set gallery mood.'
          ],
          hardware: 'Focused directional dome speakers, museum ceiling project mounts, spot track lights, digital catalog tablets.'
        }
      ],
      benefits: [
        'Immersive sensory impact that drives user attention',
        'Scalable control templates via unified control touchpads',
        'Commercial grade panels built for 24/7 high-traffic public areas'
      ]
    }
  ];

  const handleInquiryRedirect = (vTitle, spaceName = '') => {
    setActivePage('quote-cart');
    setTimeout(() => {
      const textarea = document.querySelector('textarea[name="notes"]');
      if (textarea) {
        const itemScope = spaceName ? `${vTitle} (${spaceName})` : vTitle;
        textarea.value = `We are interested in designing an AV integration system for our ${itemScope} spaces. Please contact us to schedule a site walkthrough and design consultation.`;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  };

  // Scroll to top on page or space transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedVerticalId, selectedSpaceId]);

  const activeVertical = verticalsData.find(v => v.id === selectedVerticalId);
  const activeSpace = activeVertical?.spaces.find(s => s.id === selectedSpaceId);



  return (
    <div className="container py-half animate-fade">
      
      {/* 1. LANDING GRID VIEW (No vertical selected) */}
      {!selectedVerticalId && (
        <>
          <div className="text-center mb-8">
            <span className="badge badge-brand mb-2">Industry Solutions</span>
            <h1 className="text-4xl">System Integration Verticals</h1>
            <p className="text-muted text-lg" style={{ maxWidth: '750px', margin: '0.5rem auto' }}>
              Select a vertical below to explore how we engineer bespoke acoustic and visual environments for different industries.
            </p>
          </div>

          <div className="vertical-grid">
            {verticalsData.map((vert) => (
              <div 
                key={vert.id} 
                className="vertical-card"
                onClick={() => setSelectedVerticalId(vert.id)}
              >
                <div className="vertical-card-image-wrapper">
                  <img 
                    src={vert.imagePath} 
                    alt={vert.title} 
                    className="vertical-card-image"
                  />
                  <div className="vertical-card-gradient" />
                </div>

                <div className="vertical-card-header">
                  <div className="flex align-center gap-2 mb-1">
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {vert.icon}
                    </span>
                    <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>View Segment</span>
                  </div>
                  <h2 className="text-xl" style={{ fontWeight: 800 }}>{vert.title}</h2>
                  <p className="text-muted text-xs">{vert.subtitle}</p>
                </div>

                <div className="vertical-card-hover-overlay">
                  <div>
                    <div className="flex align-center gap-2 mb-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
                      {vert.icon}
                      <h3 className="text-lg" style={{ fontWeight: 700 }}>{vert.title}</h3>
                    </div>
                    <p className="text-muted text-sm mb-4" style={{ lineHeight: 1.4 }}>
                      {vert.desc}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {vert.benefits.slice(0, 3).map((ben, idx) => (
                        <div key={idx} className="flex align-center gap-2" style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                          <span style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>{ben}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary btn-sm flex-center" style={{ width: '100%' }}>
                    Know More <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 2. DETAILED VERTICAL VIEW (Vertical selected, but no space selected) */}
      {selectedVerticalId && !selectedSpaceId && (
        <div className="animate-fade">
          <div className="mb-6">
            <button 
              className="btn btn-secondary flex-center btn-sm" 
              onClick={() => setSelectedVerticalId(null)}
              style={{ background: 'transparent', border: 'none', paddingLeft: 0 }}
            >
              <ArrowLeft size={16} /> Back to Industry Verticals
            </button>
          </div>

          <section className="glass-panel" style={{
            padding: '2.5rem',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.75) 0%, rgba(13, 18, 34, 0.75) 100%)',
            borderColor: 'rgba(99, 102, 241, 0.2)'
          }}>
            <div className="grid-cols-2" style={{ gap: '3rem' }}>
              <div className="flex flex-col justify-between" style={{ padding: '0.5rem 0' }}>
                <div>
                  <div className="flex align-center gap-2 mb-2">
                    {activeVertical.icon}
                    <span className="badge badge-brand">Bespoke Design</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{activeVertical.title} Systems</h1>
                  <h2 className="text-md uppercase mb-4" style={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {activeVertical.subtitle}
                  </h2>
                  <p className="text-muted text-md mb-6" style={{ lineHeight: 1.7 }}>
                    {activeVertical.longDesc}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="btn btn-primary" onClick={() => handleInquiryRedirect(activeVertical.title)}>
                    Request {activeVertical.title} Proposal
                  </button>
                  <button className="btn btn-secondary" onClick={() => setSelectedVerticalId(null)}>
                    All Verticals
                  </button>
                </div>
              </div>

              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 0 40px rgba(59, 130, 246, 0.15)',
                height: '340px'
              }}>
                <img 
                  src={activeVertical.imagePath} 
                  alt={activeVertical.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </section>

          {/* Space-by-Space Technical Solutions (Hover grid of spaces) */}
          <section className="mb-8">
            <div className="mb-6">
              <span className="badge badge-brand">Engineering</span>
              <h2 className="text-2xl mt-1">Space-by-Space Technical Solutions</h2>
              <p className="text-muted text-sm">Hover over any space to explore details. Click "Know More" to open detailed specifications, images, and advantages.</p>
            </div>

            {/* Custom Interactive Space Grid (Uses the same design pattern as Verticals) */}
            <div className="vertical-grid">
              {activeVertical.spaces.map((sp) => (
                <div 
                  key={sp.id} 
                  className="vertical-card"
                  onClick={() => setSelectedSpaceId(sp.id)}
                  style={{ height: '320px' }}
                >
                  <div className="vertical-card-image-wrapper">
                    <img 
                      src={sp.image || activeVertical.imagePath} 
                      alt={sp.name} 
                      className="vertical-card-image"
                    />
                    <div className="vertical-card-gradient" />
                  </div>

                  <div className="vertical-card-header" style={{ padding: '1.5rem' }}>
                    <span className="badge" style={{ fontSize: '0.6rem', marginBottom: '0.5rem' }}>Integration Space</span>
                    <h3 className="text-lg" style={{ fontWeight: 800 }}>{sp.name}</h3>
                  </div>

                  <div className="vertical-card-hover-overlay" style={{ padding: '1.5rem' }}>
                    <div>
                      <h4 className="text-md text-primary-gradient mb-2" style={{ fontWeight: 700 }}>{sp.name}</h4>
                      <p className="text-muted text-xs" style={{ lineHeight: 1.4 }}>
                        {sp.tech}
                      </p>
                    </div>
                    <button className="btn btn-primary btn-sm flex-center" style={{ width: '100%', padding: '0.4rem 0' }}>
                      Know More <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Operational Benefits Grid */}
          <section className="glass-panel mb-8" style={{ padding: '2rem' }}>
            <h2 className="text-xl mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Operational Benefits
            </h2>
            <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
              {activeVertical.benefits.map((ben, idx) => (
                <div key={idx} className="flex align-center gap-3">
                  <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', color: '#e5e7eb' }}>{ben}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 3. DETAILED SPACE VIEW (Vertical and specific space selected) */}
      {selectedVerticalId && selectedSpaceId && activeSpace && (
        <div className="animate-fade">
          <div className="mb-6">
            <button 
              className="btn btn-secondary flex-center btn-sm" 
              onClick={() => setSelectedSpaceId(null)}
              style={{ background: 'transparent', border: 'none', paddingLeft: 0 }}
            >
              <ArrowLeft size={16} /> Back to {activeVertical.title} Spaces
            </button>
          </div>

          <div className="grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
            
            {/* Left Column: Advantages & Use cases */}
            <div className="flex flex-col" style={{ gap: '1.8rem' }}>
              <div>
                <h1 className="text-3xl font-bold mb-1">{activeSpace.name}</h1>
              </div>

              <section className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 className="text-md mb-3 flex align-center gap-2" style={{ fontSize: '1.4rem' }}>
                  <Settings size={22} style={{ color: 'var(--color-primary)' }} /> Use Cases & Functionality
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {Array.isArray(activeSpace.useCases) ? (
                    activeSpace.useCases.map((uc, idx) => (
                      <li key={idx} className="flex align-center gap-2" style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                        <span>{uc}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex align-center gap-2" style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <span>{activeSpace.useCases || activeSpace.tech}</span>
                    </li>
                  )}
                </ul>
              </section>

              <section className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                <h3 className="text-md mb-3 flex align-center gap-2" style={{ fontSize: '1.4rem' }}>
                  <Laptop size={22} style={{ color: 'var(--color-secondary)' }} /> Advantages & Benefits
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {(activeSpace.advantages || ['Highly customizable AV architectures.']).map((adv, idx) => (
                    <li key={idx} className="flex align-center gap-2" style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--color-secondary)', flexShrink: 0 }} />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column: Space Image */}
            <div className="flex flex-col gap-6">
              <div className="glass-panel" style={{ padding: '1rem' }}>
                <div style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '480px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 0 20px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.2)'
                }}>
                  <img 
                    src={activeSpace.image} 
                    alt={activeSpace.name} 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: '480px', 
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
