"""
QUIZFLIX Seed Data Generator
Populates profiles, 16+ academic & general knowledge quizzes, questions,
initial leaderboards, continue quiz states, and bookmarks.
"""

import json
import sqlite3
from database import get_connection, init_db

PROFILES_DATA = [
    {
        "id": "prof-1",
        "name": "Alex Quantum",
        "avatar": "avatar-red",
        "pin": None,
        "is_kids": 0,
        "color_theme": "#E50914"
    },
    {
        "id": "prof-2",
        "name": "Elena Code",
        "avatar": "avatar-blue",
        "pin": "1337",
        "is_kids": 0,
        "color_theme": "#0080FF"
    },
    {
        "id": "prof-3",
        "name": "Marcus History",
        "avatar": "avatar-yellow",
        "pin": None,
        "is_kids": 0,
        "color_theme": "#E5A914"
    },
    {
        "id": "prof-4",
        "name": "Sophie Explorer",
        "avatar": "avatar-green",
        "pin": None,
        "is_kids": 1,
        "color_theme": "#2ECC71"
    },
    {
        "id": "prof-5",
        "name": "Nova Stellar",
        "avatar": "avatar-purple",
        "pin": "2026",
        "is_kids": 0,
        "color_theme": "#9B59B6"
    }
]

QUIZZES_DATA = [
    {
        "id": "quiz-quantum-physics",
        "title": "Quantum Realm & Theoretical Physics",
        "slug": "quantum-realm-theoretical-physics",
        "category": "Academic & STEM",
        "subcategory": "Physics",
        "description": "Dive deep into Schrödinger's paradox, quantum entanglement, wave-particle duality, and Heisenberg's uncertainty principle in this ultimate challenge for physics scholars.",
        "difficulty": "HARD",
        "duration_seconds": 360,
        "questions_count": 5,
        "backdrop_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 1,
        "top10_rank": 1,
        "match_percentage": 99,
        "author": "Dr. Sarah Hawking",
        "tags": ["Physics", "Quantum", "Relativity", "STEM Master"],
        "questions": [
            {
                "id": "qp-1",
                "question_text": "According to the Heisenberg Uncertainty Principle, what two conjugate properties of a subatomic particle cannot simultaneously be known with arbitrary precision?",
                "question_type": "multiple_choice",
                "options": ["Position and Momentum", "Energy and Charge", "Mass and Velocity", "Spin and Magnetic Moment"],
                "correct_answer": "Position and Momentum",
                "explanation": "Heisenberg's Uncertainty Principle (Δx·Δp ≥ ℏ/2) states that the more precisely the position (x) is determined, the less precisely the momentum (p) can be known.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "qp-2",
                "question_text": "What phenomenon did Albert Einstein famously dismiss as 'spooky action at a distance'?",
                "question_type": "multiple_choice",
                "options": ["Quantum Entanglement", "Gravitational Lensing", "Photoelectric Effect", "Cosmic Inflation"],
                "correct_answer": "Quantum Entanglement",
                "explanation": "Einstein, Podolsky, and Rosen (EPR Paradox) questioned quantum entanglement where two entangled particles instantaneously correlate states regardless of distance.",
                "points": 120,
                "order_num": 2
            },
            {
                "id": "qp-3",
                "question_text": "Which experiment confirmed that light and matter display behavior of both waves and particles?",
                "question_type": "multiple_choice",
                "options": ["Young's Double-Slit Experiment", "Cavendish Experiment", "Michelson-Morley Experiment", "Rutherford Gold Foil Experiment"],
                "correct_answer": "Young's Double-Slit Experiment",
                "explanation": "Thomas Young's double-slit experiment (and later single-electron variations) demonstrated interference patterns characteristic of wave-particle duality.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "qp-4",
                "question_text": "What fundamental constant connects the energy of a photon to its frequency (E = hf)?",
                "question_type": "multiple_choice",
                "options": ["Planck's Constant", "Boltzmann Constant", "Coulomb Constant", "Fine-Structure Constant"],
                "correct_answer": "Planck's Constant",
                "explanation": "Planck's constant (h ≈ 6.626 × 10⁻³⁴ J·s) is the fundamental physical constant that sets the scale of quantum mechanics.",
                "points": 100,
                "order_num": 4
            },
            {
                "id": "qp-5",
                "question_text": "What is the theoretical particle predicted to mediate the gravitational force in quantum field theories?",
                "question_type": "multiple_choice",
                "options": ["Graviton", "Higgs Boson", "Gluon", "Z Boson"],
                "correct_answer": "Graviton",
                "explanation": "The graviton is the hypothetical spin-2 elementary particle postulated to mediate gravity in quantum gravity frameworks.",
                "points": 150,
                "order_num": 5
            }
        ]
    },
    {
        "id": "quiz-python-mastery",
        "title": "Python & Data Structures Masterclass",
        "slug": "python-data-structures-masterclass",
        "category": "Academic & STEM",
        "subcategory": "Computer Science",
        "description": "Test your mastery over Python internals, generator pipelines, time complexities O(n), memory allocation, and concurrency models.",
        "difficulty": "MASTER",
        "duration_seconds": 300,
        "questions_count": 5,
        "backdrop_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 1,
        "top10_rank": 2,
        "match_percentage": 98,
        "author": "Guido Van Geek",
        "tags": ["Python", "Algorithms", "Software Engineering", "Coding"],
        "questions": [
            {
                "id": "py-1",
                "question_text": "What is the average time complexity for searching an element in a Python dictionary / hash table?",
                "question_type": "multiple_choice",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct_answer": "O(1)",
                "explanation": "Python dictionaries are implemented as high-performance hash tables, offering O(1) average time complexity for key lookups and insertions.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "py-2",
                "question_text": "Which mechanism prevents multiple native threads from executing Python bytecodes simultaneously in CPython?",
                "question_type": "multiple_choice",
                "options": ["GIL (Global Interpreter Lock)", "JIT Compiler", "Garbage Collector Mark-Sweep", "Thread Mutex Barrier"],
                "correct_answer": "GIL (Global Interpreter Lock)",
                "explanation": "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing CPython bytecode at once.",
                "points": 120,
                "order_num": 2
            },
            {
                "id": "py-3",
                "question_text": "What keyword transforms a regular Python function into a Generator that yields values lazily?",
                "question_type": "multiple_choice",
                "options": ["yield", "async", "return_lazy", "defer"],
                "correct_answer": "yield",
                "explanation": "Using 'yield' produces a generator object which pauses execution and maintains state across successive next() invocations.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "py-4",
                "question_text": "Which sorting algorithm is natively utilized by Python's list.sort() and sorted() built-ins?",
                "question_type": "multiple_choice",
                "options": ["Timsort", "QuickSort", "HeapSort", "MergeSort"],
                "correct_answer": "Timsort",
                "explanation": "Timsort is a hybrid stable sorting algorithm derived from merge sort and insertion sort, created by Tim Peters in 2002.",
                "points": 110,
                "order_num": 4
            },
            {
                "id": "py-5",
                "question_text": "What is the output of: `print([i*2 for i in range(4) if i % 2 == 0])`?",
                "question_type": "multiple_choice",
                "options": ["[0, 4]", "[0, 2, 4]", "[2, 6]", "[0, 2, 4, 6]"],
                "correct_answer": "[0, 4]",
                "explanation": "range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Multiplying by 2 results in [0, 4].",
                "points": 100,
                "order_num": 5
            }
        ]
    },
    {
        "id": "quiz-calculus-wonders",
        "title": "Calculus & Infinite Dimensions",
        "slug": "calculus-infinite-dimensions",
        "category": "Academic & STEM",
        "subcategory": "Mathematics",
        "description": "Differential equations, Taylor series expansions, Stokes' theorem, and multivariable integrals for math enthusiasts.",
        "difficulty": "HARD",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
        "is_trending": 0,
        "is_top10": 1,
        "top10_rank": 3,
        "match_percentage": 94,
        "author": "Prof. Euler Newton",
        "tags": ["Calculus", "Mathematics", "Analysis", "Geometry"],
        "questions": [
            {
                "id": "calc-1",
                "question_text": "What is the derivative of f(x) = ln(3x² + 1) with respect to x?",
                "question_type": "multiple_choice",
                "options": ["6x / (3x² + 1)", "3x / (3x² + 1)", "1 / (6x)", "6 / (3x² + 1)"],
                "correct_answer": "6x / (3x² + 1)",
                "explanation": "By chain rule, d/dx[ln(u)] = u'/u. With u = 3x² + 1, u' = 6x, yielding 6x / (3x² + 1).",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "calc-2",
                "question_text": "What is the value of the limit: lim (x->0) [sin(x) / x]?",
                "question_type": "multiple_choice",
                "options": ["1", "0", "Infinity", "Undefined"],
                "correct_answer": "1",
                "explanation": "This fundamental trigonometric limit evaluates to 1, as proven by the Squeeze (Sandwich) Theorem or L'Hôpital's Rule.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "calc-3",
                "question_text": "Which fundamental theorem relates the surface integral of the curl of a vector field over an open surface to a line integral around its boundary?",
                "question_type": "multiple_choice",
                "options": ["Stokes' Theorem", "Divergence Theorem", "Green's Theorem in 1D", "Cauchy Integral Theorem"],
                "correct_answer": "Stokes' Theorem",
                "explanation": "Stokes' Theorem states that ∬_S (∇ × F) · dS = ∮_C F · dr for a smooth oriented surface S with boundary curve C.",
                "points": 150,
                "order_num": 3
            },
            {
                "id": "calc-4",
                "question_text": "What is the integral of e^(2x) dx?",
                "question_type": "multiple_choice",
                "options": ["(1/2)e^(2x) + C", "2e^(2x) + C", "e^(2x) + C", "(1/4)e^(2x) + C"],
                "correct_answer": "(1/2)e^(2x) + C",
                "explanation": "Using u-substitution u = 2x, du = 2 dx, the integral becomes (1/2)∫ e^u du = (1/2)e^(2x) + C.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-genetics-crispr",
        "title": "Genetics, DNA & The CRISPR Revolution",
        "slug": "genetics-dna-crispr-revolution",
        "category": "Academic & STEM",
        "subcategory": "Biology",
        "description": "Explore DNA replication, transcription mechanisms, epigenetics, and gene editing breakthroughs that are rewriting biotechnology.",
        "difficulty": "MEDIUM",
        "duration_seconds": 240,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 1,
        "top10_rank": 4,
        "match_percentage": 96,
        "author": "Dr. Jennifer Doudna Fan",
        "tags": ["Biology", "Genetics", "CRISPR", "Medicine"],
        "questions": [
            {
                "id": "gen-1",
                "question_text": "What does the molecular acronym 'CRISPR' stand for in genetic engineering?",
                "question_type": "multiple_choice",
                "options": [
                    "Clustered Regularly Interspaced Short Palindromic Repeats",
                    "Cellular RNA Induced Specific Protein Replicators",
                    "Chromosomal Recombinant Interspaced Sequence Polymorphism Recorders",
                    "Core RNA Interspaced Structural Polymorphic Regions"
                ],
                "correct_answer": "Clustered Regularly Interspaced Short Palindromic Repeats",
                "explanation": "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats, an adaptive immune defense found in bacteria.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "gen-2",
                "question_text": "Which nitrogenous base pairs with Adenine (A) in standard RNA molecules?",
                "question_type": "multiple_choice",
                "options": ["Uracil (U)", "Thymine (T)", "Cytosine (C)", "Guanine (G)"],
                "correct_answer": "Uracil (U)",
                "explanation": "In RNA, Uracil (U) replaces Thymine (T) and forms complementary base pairs with Adenine.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "gen-3",
                "question_text": "What enzyme is responsible for unwinding the double helix during DNA replication?",
                "question_type": "multiple_choice",
                "options": ["DNA Helicase", "DNA Polymerase", "DNA Ligase", "Topoisomerase"],
                "correct_answer": "DNA Helicase",
                "explanation": "DNA Helicase breaks the hydrogen bonds between nucleotide pairs, unwinding the double helix at the replication fork.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "gen-4",
                "question_text": "What is the powerhouse organelle of the eukaryotic cell containing its own distinct circular DNA?",
                "question_type": "multiple_choice",
                "options": ["Mitochondria", "Ribosome", "Endoplasmic Reticulum", "Golgi Apparatus"],
                "correct_answer": "Mitochondria",
                "explanation": "Mitochondria carry maternal circular mtDNA, supporting the endosymbiotic theory of cellular evolution.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-cybersecurity-defense",
        "title": "Cybersecurity & Zero-Trust Defense",
        "slug": "cybersecurity-zero-trust-defense",
        "category": "Academic & STEM",
        "subcategory": "Computer Science",
        "description": "Master asymmetric cryptography, buffer overflow exploits, MITM attacks, zero-day vulnerabilities, and SOC defense tactics.",
        "difficulty": "MASTER",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 1,
        "top10_rank": 5,
        "match_percentage": 97,
        "author": "RedTeam Elite",
        "tags": ["Cybersecurity", "Network", "Cryptography", "Hacking"],
        "questions": [
            {
                "id": "sec-1",
                "question_text": "What asymmetric encryption algorithm relies on the mathematical difficulty of factoring large prime numbers?",
                "question_type": "multiple_choice",
                "options": ["RSA", "AES-256", "SHA-3", "Blowfish"],
                "correct_answer": "RSA",
                "explanation": "RSA (Rivest–Shamir–Adleman) is an asymmetric public-key cryptosystem based on the practical difficulty of factoring the product of two large prime numbers.",
                "points": 120,
                "order_num": 1
            },
            {
                "id": "sec-2",
                "question_text": "What core principle defines the Zero-Trust Architecture security model?",
                "question_type": "multiple_choice",
                "options": ["Never trust, always verify", "Trust internal network only", "Rely entirely on firewall perimeter", "Disable all user passwords"],
                "correct_answer": "Never trust, always verify",
                "explanation": "Zero Trust operates on the principle 'never trust, always verify', requiring strict continuous authentication regardless of network location.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "sec-3",
                "question_text": "Which vulnerability occurs when an application includes untrusted user input directly into a database command?",
                "question_type": "multiple_choice",
                "options": ["SQL Injection (SQLi)", "Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)", "Buffer Overflow"],
                "correct_answer": "SQL Injection (SQLi)",
                "explanation": "SQL Injection allows attackers to manipulate backend database queries by injecting unsanitized SQL statements.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "sec-4",
                "question_text": "What protocol secures HTTP traffic by utilizing Transport Layer Security (TLS)?",
                "question_type": "multiple_choice",
                "options": ["HTTPS (Port 443)", "SSH (Port 22)", "FTP (Port 21)", "SNMP (Port 161)"],
                "correct_answer": "HTTPS (Port 443)",
                "explanation": "HTTPS runs over TLS/SSL on port 443 to provide encryption, authentication, and data integrity over the web.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-ww2-history",
        "title": "World War II: Turning Points & Strategies",
        "slug": "world-war-ii-turning-points-strategies",
        "category": "General Knowledge & History",
        "subcategory": "World History",
        "description": "Test your historical knowledge of Operation Overlord, the Battle of Stalingrad, codebreaking at Bletchley Park, and post-war treaties.",
        "difficulty": "MEDIUM",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1578836537282-3171d77f8632?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
        "is_trending": 0,
        "is_top10": 1,
        "top10_rank": 6,
        "match_percentage": 92,
        "author": "Churchill Archive",
        "tags": ["History", "War", "20th Century", "Strategy"],
        "questions": [
            {
                "id": "ww2-1",
                "question_text": "What was the official codename for the Allied amphibious invasion of Normandy on June 6, 1944 (D-Day)?",
                "question_type": "multiple_choice",
                "options": ["Operation Overlord", "Operation Barbarossa", "Operation Torch", "Operation Market Garden"],
                "correct_answer": "Operation Overlord",
                "explanation": "Operation Overlord was the Allied codename for the Battle of Normandy, the largest amphibious invasion in history.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "ww2-2",
                "question_text": "Who led the British cryptanalysis team at Bletchley Park that deciphered the German Enigma cipher machine?",
                "question_type": "multiple_choice",
                "options": ["Alan Turing", "John von Neumann", "Claude Shannon", "Ada Lovelace"],
                "correct_answer": "Alan Turing",
                "explanation": "Alan Turing designed the electromechanical Bombe machine to break the German Enigma cipher at Bletchley Park.",
                "points": 120,
                "order_num": 2
            },
            {
                "id": "ww2-3",
                "question_text": "Which brutal Eastern Front conflict (1942-1943) marked the decisive turning point against Axis forces in Europe?",
                "question_type": "multiple_choice",
                "options": ["Battle of Stalingrad", "Battle of Kursk", "Siege of Leningrad", "Battle of Britain"],
                "correct_answer": "Battle of Stalingrad",
                "explanation": "The Soviet victory at Stalingrad resulted in the destruction of the German 6th Army and turned the tide on the Eastern Front.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "ww2-4",
                "question_text": "In which city was the post-war conference held in February 1945 by Roosevelt, Churchill, and Stalin to plan the re-establishment of nations?",
                "question_type": "multiple_choice",
                "options": ["Yalta", "Potsdam", "Tehran", "Geneva"],
                "correct_answer": "Yalta",
                "explanation": "The Yalta Conference was held in Crimea in February 1945 by the 'Big Three' leaders to discuss post-war European reorganization.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-astrophysics-space",
        "title": "Cosmic Wonders: Astrophysics & Black Holes",
        "slug": "cosmic-wonders-astrophysics-black-holes",
        "category": "Academic & STEM",
        "subcategory": "Astronomy",
        "description": "Journey through event horizons, neutron stars, cosmic microwave background, exoplanetary systems, and the James Webb Space Telescope discoveries.",
        "difficulty": "HARD",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 1,
        "top10_rank": 7,
        "match_percentage": 95,
        "author": "Carl Sagan Institute",
        "tags": ["Space", "Astrophysics", "Black Holes", "NASA"],
        "questions": [
            {
                "id": "sp-1",
                "question_text": "What is the boundary around a black hole beyond which no information or light can escape called?",
                "question_type": "multiple_choice",
                "options": ["Event Horizon", "Schwarzschild Photon Sphere", "Ergosphere", "Accretion Disk"],
                "correct_answer": "Event Horizon",
                "explanation": "The event horizon is the threshold where escape velocity equals the speed of light.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "sp-2",
                "question_text": "What supermassive black hole lies at the center of our Milky Way galaxy?",
                "question_type": "multiple_choice",
                "options": ["Sagittarius A*", "Messier 87*", "Cygnus X-1", "Andromeda Prime"],
                "correct_answer": "Sagittarius A*",
                "explanation": "Sagittarius A* is the supermassive black hole located at the Galactic Center of the Milky Way, approximately 4.3 million solar masses.",
                "points": 110,
                "order_num": 2
            },
            {
                "id": "sp-3",
                "question_text": "What type of extremely dense stellar remnant forms when a massive star undergoes a core-collapse supernova without becoming a black hole?",
                "question_type": "multiple_choice",
                "options": ["Neutron Star / Pulsar", "White Dwarf", "Red Giant", "Brown Dwarf"],
                "correct_answer": "Neutron Star / Pulsar",
                "explanation": "Neutron stars are supported against gravitational collapse by neutron degeneracy pressure and often spin rapidly as pulsars.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "sp-4",
                "question_text": "What space observatory launched on Christmas Day 2021 observes the universe primarily in high-resolution Infrared wavelengths?",
                "question_type": "multiple_choice",
                "options": ["James Webb Space Telescope (JWST)", "Hubble Space Telescope", "Chandra X-ray Observatory", "Spitzer Space Telescope"],
                "correct_answer": "James Webb Space Telescope (JWST)",
                "explanation": "The JWST operates at the Sun-Earth L2 Lagrange point, capturing infrared light from the earliest galaxies.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-cinema-classics",
        "title": "Masterpieces of Cinema & Oscar Lore",
        "slug": "masterpieces-of-cinema-oscar-lore",
        "category": "General Knowledge & History",
        "subcategory": "Pop Culture & Cinema",
        "description": "Celebrate iconic film directors, groundbreaking cinematography, Oscar records, and legendary movie dialogues from Hollywood and international cinema.",
        "difficulty": "EASY",
        "duration_seconds": 240,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
        "is_trending": 0,
        "is_top10": 1,
        "top10_rank": 8,
        "match_percentage": 91,
        "author": "Cinephile Vault",
        "tags": ["Movies", "Hollywood", "Oscars", "Directors"],
        "questions": [
            {
                "id": "cin-1",
                "question_text": "Which movie won 11 Academy Awards and holds the tie record for most Oscar wins with Titanic and Ben-Hur?",
                "question_type": "multiple_choice",
                "options": ["The Lord of the Rings: The Return of the King", "Avatar", "La La Land", "Oppenheimer"],
                "correct_answer": "The Lord of the Rings: The Return of the King",
                "explanation": "The Return of the King (2003) won all 11 Oscars it was nominated for, sweeping every category.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "cin-2",
                "question_text": "Who directed the timeless cinematic masterpiece 'Pulp Fiction' (1994)?",
                "question_type": "multiple_choice",
                "options": ["Quentin Tarantino", "Martin Scorsese", "Steven Spielberg", "Christopher Nolan"],
                "correct_answer": "Quentin Tarantino",
                "explanation": "Quentin Tarantino wrote and directed Pulp Fiction, winning the Palme d'Or and the Academy Award for Best Original Screenplay.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "cin-3",
                "question_text": "What was the first feature-length animated movie released by Walt Disney in 1937?",
                "question_type": "multiple_choice",
                "options": ["Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Bambi"],
                "correct_answer": "Snow White and the Seven Dwarfs",
                "explanation": "Snow White and the Seven Dwarfs was the world's first full-length cel-animated feature film in Technicolor.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "cin-4",
                "question_text": "Which South Korean film made history in 2020 by becoming the first non-English language movie to win Best Picture?",
                "question_type": "multiple_choice",
                "options": ["Parasite", "Train to Busan", "Oldboy", "The Handmaiden"],
                "correct_answer": "Parasite",
                "explanation": "Bong Joon-ho's 'Parasite' won 4 Oscars including Best Picture, Best Director, and Best International Feature.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-organic-chemistry",
        "title": "Organic Chemistry Reactions & Synthesis",
        "slug": "organic-chemistry-reactions-synthesis",
        "category": "Academic & STEM",
        "subcategory": "Chemistry",
        "description": "SN1 vs SN2 nucleophilic substitutions, electrophilic aromatic substitution, stereochemistry, chiral carbons, and NMR spectroscopy.",
        "difficulty": "HARD",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=600&auto=format&fit=crop",
        "is_trending": 0,
        "is_top10": 1,
        "top10_rank": 9,
        "match_percentage": 90,
        "author": "Lab Chemistry Guild",
        "tags": ["Chemistry", "Organic", "Molecules", "Science"],
        "questions": [
            {
                "id": "ch-1",
                "question_text": "Which reaction mechanism proceeds through a carbocation intermediate with racemization of configuration?",
                "question_type": "multiple_choice",
                "options": ["SN1 Mechanism", "SN2 Mechanism", "E2 Mechanism", "Addition-Elimination"],
                "correct_answer": "SN1 Mechanism",
                "explanation": "SN1 is a two-step unimolecular nucleophilic substitution where rate depends solely on the substrate, creating a planar carbocation intermediate.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "ch-2",
                "question_text": "What type of hybridization is present in the carbon atoms of a benzene ring (C6H6)?",
                "question_type": "multiple_choice",
                "options": ["sp2 Hybridization", "sp3 Hybridization", "sp Hybridization", "dsp2 Hybridization"],
                "correct_answer": "sp2 Hybridization",
                "explanation": "All 6 carbon atoms in benzene are sp2 hybridized, forming a planar ring with delocalized pi electrons.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "ch-3",
                "question_text": "Which functional group is characterized by a carbonyl group bonded to a hydroxyl group (-COOH)?",
                "question_type": "multiple_choice",
                "options": ["Carboxylic Acid", "Ester", "Ketone", "Aldehyde"],
                "correct_answer": "Carboxylic Acid",
                "explanation": "Carboxylic acids contain the -COOH group and exhibit acidic properties by donating a proton.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "ch-4",
                "question_text": "What catalyst is traditionally used in the Friedel-Crafts alkylation of benzene?",
                "question_type": "multiple_choice",
                "options": ["AlCl3 (Anhydrous Aluminum Chloride)", "Pt / Pd on Carbon", "KMnO4", "NaBH4"],
                "correct_answer": "AlCl3 (Anhydrous Aluminum Chloride)",
                "explanation": "Anhydrous AlCl3 acts as a Lewis acid catalyst to generate the strong electrophilic carbocation from alkyl halides.",
                "points": 110,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-world-geography",
        "title": "World Geography & Extreme Landscapes",
        "slug": "world-geography-extreme-landscapes",
        "category": "General Knowledge & History",
        "subcategory": "Geography",
        "description": "Traverse the highest peaks, deepest ocean trenches, transcontinental nations, microstates, and tectonic fault lines across the globe.",
        "difficulty": "MEDIUM",
        "duration_seconds": 240,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
        "is_trending": 0,
        "is_top10": 1,
        "top10_rank": 10,
        "match_percentage": 93,
        "author": "National Geo Explorer",
        "tags": ["Geography", "World", "Earth", "Travel"],
        "questions": [
            {
                "id": "geo-1",
                "question_text": "What is the deepest known oceanic trench on Earth?",
                "question_type": "multiple_choice",
                "options": ["Mariana Trench (Challenger Deep)", "Puerto Rico Trench", "Java Trench", "Tonga Trench"],
                "correct_answer": "Mariana Trench (Challenger Deep)",
                "explanation": "The Challenger Deep in the Mariana Trench reaches approximately 10,994 meters (36,070 feet) below sea level.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "geo-2",
                "question_text": "Which river is recognized as the longest in the world by the majority of geographic institutions?",
                "question_type": "multiple_choice",
                "options": ["Nile River", "Amazon River", "Yangtze River", "Mississippi River"],
                "correct_answer": "Nile River",
                "explanation": "The Nile River spans roughly 6,650 km (4,132 miles), flowing northward through northeastern Africa.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "geo-3",
                "question_text": "What is the smallest independent recognized sovereign country in the world by land area?",
                "question_type": "multiple_choice",
                "options": ["Vatican City", "Monaco", "Nauru", "San Marino"],
                "correct_answer": "Vatican City",
                "explanation": "Vatican City covers an area of just 0.49 square kilometers (121 acres) completely enclaved within Rome, Italy.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "geo-4",
                "question_text": "Which major mountain range forms the natural geographic divide between the continents of Europe and Asia?",
                "question_type": "multiple_choice",
                "options": ["Ural Mountains", "Alps", "Caucasus Mountains", "Carpathians"],
                "correct_answer": "Ural Mountains",
                "explanation": "The Ural Mountains run north-to-south through western Russia, delineating Europe from Asia.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-philosophy-thought",
        "title": "Great Philosophers & Mind Experiments",
        "slug": "great-philosophers-mind-experiments",
        "category": "General Knowledge & History",
        "subcategory": "Philosophy",
        "description": "Explore Plato's Cave, Nietzsche's Ubermensch, Descartes' Cogito, the Trolley Problem, and ethical dilemmas throughout human civilization.",
        "difficulty": "HARD",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop",
        "is_trending": 0,
        "is_top10": 0,
        "top10_rank": 0,
        "match_percentage": 89,
        "author": "Socrates Academy",
        "tags": ["Philosophy", "Ethics", "Logic", "Humanities"],
        "questions": [
            {
                "id": "phi-1",
                "question_text": "Which French philosopher wrote the foundational proposition 'Cogito, ergo sum' (I think, therefore I am)?",
                "question_type": "multiple_choice",
                "options": ["René Descartes", "Jean-Jacques Rousseau", "Voltaire", "Michel Foucault"],
                "correct_answer": "René Descartes",
                "explanation": "Descartes formulated 'Cogito, ergo sum' in his 1637 Discourse on Method to establish an indubitable truth against skepticism.",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "phi-2",
                "question_text": "What ethical theory formulated by Jeremy Bentham and John Stuart Mill advocates for 'the greatest happiness for the greatest number'?",
                "question_type": "multiple_choice",
                "options": ["Utilitarianism", "Deontology (Kantianism)", "Virtue Ethics", "Nihilism"],
                "correct_answer": "Utilitarianism",
                "explanation": "Utilitarianism is a consequentialist ethical framework that evaluates actions based on their net contribution to overall well-being.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "phi-3",
                "question_text": "In Plato's Allegory of the Cave, what do the shadows on the wall represent to the chained prisoners?",
                "question_type": "multiple_choice",
                "options": ["The illusion of sensory physical reality", "Divine truth and Enlightenment", "Mathematics and geometry", "Pure Forms"],
                "correct_answer": "The illusion of sensory physical reality",
                "explanation": "The shadows represent superficial reality perceived through human senses, contrasted with the true world of Forms outside the cave.",
                "points": 120,
                "order_num": 3
            },
            {
                "id": "phi-4",
                "question_text": "What ancient philosophical school founded by Zeno of Citium emphasizes virtue, logic, self-control, and accepting what cannot be changed?",
                "question_type": "multiple_choice",
                "options": ["Stoicism", "Epicureanism", "Cynicism", "Hedonism"],
                "correct_answer": "Stoicism",
                "explanation": "Stoicism teaches that virtue is the only good, and individuals should master their emotional responses to external events.",
                "points": 100,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-ai-neural-networks",
        "title": "Artificial Intelligence & Neural Networks",
        "slug": "ai-neural-networks-deep-learning",
        "category": "Academic & STEM",
        "subcategory": "Computer Science",
        "description": "Transformers, attention mechanisms, backpropagation algorithms, LLMs, convolutional layers, and reinforcement learning.",
        "difficulty": "HARD",
        "duration_seconds": 300,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 0,
        "top10_rank": 0,
        "match_percentage": 98,
        "author": "OpenAI/DeepMind Circle",
        "tags": ["AI", "Neural Networks", "Deep Learning", "LLMs"],
        "questions": [
            {
                "id": "ai-1",
                "question_text": "What landmark 2017 research paper introduced the Transformer architecture based on Multi-Head Self-Attention?",
                "question_type": "multiple_choice",
                "options": ["Attention Is All You Need", "Deep Residual Learning for Image Recognition", "Generative Adversarial Nets", "Mastering the Game of Go"],
                "correct_answer": "Attention Is All You Need",
                "explanation": "Vaswani et al. (2017) introduced the Transformer architecture which revolutionized Natural Language Processing and generative AI.",
                "points": 120,
                "order_num": 1
            },
            {
                "id": "ai-2",
                "question_text": "What fundamental optimization algorithm is used to compute gradients and adjust weights in deep neural network training?",
                "question_type": "multiple_choice",
                "options": ["Backpropagation with Gradient Descent", "A* Pathfinding", "Dijkstra's Algorithm", "Simulated Annealing"],
                "correct_answer": "Backpropagation with Gradient Descent",
                "explanation": "Backpropagation applies the chain rule of calculus to calculate error gradients with respect to each weight in the network.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "ai-3",
                "question_text": "Which activation function is most widely used in hidden layers of modern deep networks due to its simplicity and resistance to vanishing gradients for positive inputs?",
                "question_type": "multiple_choice",
                "options": ["ReLU (Rectified Linear Unit)", "Sigmoid", "Hyperbolic Tangent (Tanh)", "Softmax"],
                "correct_answer": "ReLU (Rectified Linear Unit)",
                "explanation": "ReLU f(x) = max(0, x) provides computational efficiency and avoids saturation gradients for positive values.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "ai-4",
                "question_text": "What technique aligns large language models with human preferences using reward models and reinforcement learning?",
                "question_type": "multiple_choice",
                "options": ["RLHF (Reinforcement Learning from Human Feedback)", "K-Means Clustering", "PCA Dimensionality Reduction", "Batch Normalization"],
                "correct_answer": "RLHF (Reinforcement Learning from Human Feedback)",
                "explanation": "RLHF fine-tunes LLMs using human evaluators to train a reward model optimized via algorithms like PPO (Proximal Policy Optimization).",
                "points": 120,
                "order_num": 4
            }
        ]
    },
    {
        "id": "quiz-speed-blitz-trivia",
        "title": "Speed Blitz: 5-Minute Brain Teasers",
        "slug": "speed-blitz-5-minute-brain-teasers",
        "category": "Quick Blitz (5-Min)",
        "subcategory": "Logic & Trivia",
        "description": "Fast-paced logic, rapid trivia, lateral thinking puzzles, and lightning rounds to test your reflex and quick deduction.",
        "difficulty": "EASY",
        "duration_seconds": 180,
        "questions_count": 4,
        "backdrop_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
        "poster_url": "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=600&auto=format&fit=crop",
        "is_trending": 1,
        "is_top10": 0,
        "top10_rank": 0,
        "match_percentage": 99,
        "author": "Blitz Masters",
        "tags": ["Quick", "Blitz", "Logic", "Riddles"],
        "questions": [
            {
                "id": "blitz-1",
                "question_text": "If a plane crashes exactly on the border between the United States and Canada, where do they bury the survivors?",
                "question_type": "multiple_choice",
                "options": ["You don't bury survivors!", "United States", "Canada", "In international waters"],
                "correct_answer": "You don't bury survivors!",
                "explanation": "Survivors are alive, so they are not buried!",
                "points": 100,
                "order_num": 1
            },
            {
                "id": "blitz-2",
                "question_text": "How many seconds are in one full hour?",
                "question_type": "multiple_choice",
                "options": ["3,600 seconds", "600 seconds", "36,000 seconds", "1,800 seconds"],
                "correct_answer": "3,600 seconds",
                "explanation": "60 seconds per minute × 60 minutes per hour = 3,600 seconds.",
                "points": 100,
                "order_num": 2
            },
            {
                "id": "blitz-3",
                "question_text": "Which chemical element has the highest thermal and electrical conductivity of all metals?",
                "question_type": "multiple_choice",
                "options": ["Silver (Ag)", "Copper (Cu)", "Gold (Au)", "Aluminum (Al)"],
                "correct_answer": "Silver (Ag)",
                "explanation": "Silver has the highest electrical conductivity (6.3 × 10^7 S/m) and thermal conductivity of any known metal.",
                "points": 100,
                "order_num": 3
            },
            {
                "id": "blitz-4",
                "question_text": "What word is always spelled incorrectly in every dictionary?",
                "question_type": "multiple_choice",
                "options": ["'Incorrectly'", "'Misspelled'", "'Dictionary'", "'Phonetic'"],
                "correct_answer": "'Incorrectly'",
                "explanation": "The word 'incorrectly' is always spelled I-N-C-O-R-R-E-C-T-L-Y!",
                "points": 100,
                "order_num": 4
            }
        ]
    }
]

def seed_database():
    """Initializes tables and seeds rich profile, quiz, and demo state data."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # Seed Profiles
    for p in PROFILES_DATA:
        cursor.execute("""
        INSERT INTO profiles (id, name, avatar, pin, is_kids, color_theme)
        VALUES (:id, :name, :avatar, :pin, :is_kids, :color_theme)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            avatar = excluded.avatar,
            pin = excluded.pin,
            is_kids = excluded.is_kids,
            color_theme = excluded.color_theme
        """, p)

    # Seed Quizzes & Questions
    for q in QUIZZES_DATA:
        cursor.execute("""
        INSERT INTO quizzes (id, title, slug, category, subcategory, description, difficulty, duration_seconds, questions_count, backdrop_url, poster_url, is_trending, is_top10, top10_rank, match_percentage, author, tags)
        VALUES (:id, :title, :slug, :category, :subcategory, :description, :difficulty, :duration_seconds, :questions_count, :backdrop_url, :poster_url, :is_trending, :is_top10, :top10_rank, :match_percentage, :author, :tags)
        ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            category = excluded.category,
            subcategory = excluded.subcategory,
            description = excluded.description,
            difficulty = excluded.difficulty,
            duration_seconds = excluded.duration_seconds,
            questions_count = excluded.questions_count,
            backdrop_url = excluded.backdrop_url,
            poster_url = excluded.poster_url,
            is_trending = excluded.is_trending,
            is_top10 = excluded.is_top10,
            top10_rank = excluded.top10_rank,
            match_percentage = excluded.match_percentage,
            author = excluded.author,
            tags = excluded.tags
        """, {
            **q,
            "tags": json.dumps(q["tags"])
        })

        # Insert Questions
        for ques in q["questions"]:
            cursor.execute("""
            INSERT INTO questions (id, quiz_id, question_text, question_type, options_json, correct_answer, explanation, points, order_num)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                question_text = excluded.question_text,
                options_json = excluded.options_json,
                correct_answer = excluded.correct_answer,
                explanation = excluded.explanation,
                points = excluded.points,
                order_num = excluded.order_num
            """, (
                ques["id"],
                q["id"],
                ques["question_text"],
                ques["question_type"],
                json.dumps(ques["options"]),
                ques["correct_answer"],
                ques["explanation"],
                ques["points"],
                ques["order_num"]
            ))

    # Seed Bookmarks (My Quiz for Alex prof-1)
    cursor.execute("INSERT OR IGNORE INTO bookmarks (profile_id, quiz_id) VALUES ('prof-1', 'quiz-quantum-physics')")
    cursor.execute("INSERT OR IGNORE INTO bookmarks (profile_id, quiz_id) VALUES ('prof-1', 'quiz-python-mastery')")
    cursor.execute("INSERT OR IGNORE INTO bookmarks (profile_id, quiz_id) VALUES ('prof-1', 'quiz-astrophysics-space')")
    cursor.execute("INSERT OR IGNORE INTO bookmarks (profile_id, quiz_id) VALUES ('prof-2', 'quiz-python-mastery')")
    cursor.execute("INSERT OR IGNORE INTO bookmarks (profile_id, quiz_id) VALUES ('prof-2', 'quiz-cybersecurity-defense')")

    # Seed Continue Watching / Progress for prof-1 (Alex)
    cursor.execute("""
    INSERT OR REPLACE INTO quiz_progress (profile_id, quiz_id, current_question_index, selected_answers_json, time_elapsed, time_remaining, total_questions, status, last_updated)
    VALUES (
        'prof-1',
        'quiz-quantum-physics',
        2,
        '{"qp-1": "Position and Momentum", "qp-2": "Quantum Entanglement"}',
        78,
        282,
        5,
        'in_progress',
        CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    INSERT OR REPLACE INTO quiz_progress (profile_id, quiz_id, current_question_index, selected_answers_json, time_elapsed, time_remaining, total_questions, status, last_updated)
    VALUES (
        'prof-1',
        'quiz-calculus-wonders',
        1,
        '{"calc-1": "6x / (3x² + 1)"}',
        42,
        258,
        4,
        'in_progress',
        CURRENT_TIMESTAMP
    )
    """)

    # Seed Quiz History and Leaderboards for Top Scorer Billboard & Hall of Fame
    cursor.execute("""
    INSERT OR REPLACE INTO quiz_history (id, profile_id, quiz_id, score, max_score, percentage, correct_count, total_questions, time_spent_seconds, answers_json, completed_at)
    VALUES 
    ('hist-1', 'prof-1', 'quiz-quantum-physics', 570, 570, 100.0, 5, 5, 142, '{}', '2026-08-24 14:20:00'),
    ('hist-2', 'prof-2', 'quiz-python-mastery', 530, 530, 100.0, 5, 5, 118, '{}', '2026-08-24 15:45:00'),
    ('hist-3', 'prof-3', 'quiz-ww2-history', 420, 420, 100.0, 4, 4, 160, '{}', '2026-08-24 18:10:00'),
    ('hist-4', 'prof-5', 'quiz-astrophysics-space', 410, 410, 100.0, 4, 4, 125, '{}', '2026-08-24 20:30:00'),
    ('hist-5', 'prof-1', 'quiz-genetics-crispr', 400, 400, 100.0, 4, 4, 130, '{}', '2026-08-25 08:00:00')
    """)

    conn.commit()
    conn.close()
    print("QUIZFLIX SQLite database seeded successfully!")

if __name__ == "__main__":
    seed_database()
