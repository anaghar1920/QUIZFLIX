/**
 * QUIZFLIX Unified Data & API Sync Layer
 * Manages REST API requests to the Flask server with automatic local fallback.
 */

const Data = (function () {
    const API_BASE = "/api";

    // 16 Rich Offline Fallback Seed Quizzes with complete questions & explanations
    const FALLBACK_QUIZZES = [
        {
            id: "quiz-quantum-physics",
            title: "Quantum Realm & Theoretical Physics",
            slug: "quantum-realm-theoretical-physics",
            category: "Academic & STEM",
            subcategory: "Physics",
            description: "Dive deep into Schrödinger's paradox, quantum entanglement, wave-particle duality, and Heisenberg's uncertainty principle in this ultimate challenge for physics scholars.",
            difficulty: "HARD",
            duration_seconds: 360,
            questions_count: 5,
            backdrop_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop",
            is_trending: 1,
            is_top10: 1,
            top10_rank: 1,
            match_percentage: 99,
            author: "Dr. Sarah Hawking",
            tags: ["Physics", "Quantum", "Relativity", "STEM Master"],
            questions: [
                {
                    id: "qp-1",
                    question_text: "According to the Heisenberg Uncertainty Principle, what two conjugate properties of a subatomic particle cannot simultaneously be known with arbitrary precision?",
                    question_type: "multiple_choice",
                    options: ["Position and Momentum", "Energy and Charge", "Mass and Velocity", "Spin and Magnetic Moment"],
                    correct_answer: "Position and Momentum",
                    explanation: "Heisenberg's Uncertainty Principle (Δx·Δp ≥ ℏ/2) states that the more precisely the position (x) is determined, the less precisely the momentum (p) can be known.",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "qp-2",
                    question_text: "What phenomenon did Albert Einstein famously dismiss as 'spooky action at a distance'?",
                    question_type: "multiple_choice",
                    options: ["Quantum Entanglement", "Gravitational Lensing", "Photoelectric Effect", "Cosmic Inflation"],
                    correct_answer: "Quantum Entanglement",
                    explanation: "Einstein, Podolsky, and Rosen (EPR Paradox) questioned quantum entanglement where two entangled particles instantaneously correlate states regardless of distance.",
                    points: 120,
                    order_num: 2
                },
                {
                    id: "qp-3",
                    question_text: "Which experiment confirmed that light and matter display behavior of both waves and particles?",
                    question_type: "multiple_choice",
                    options: ["Young's Double-Slit Experiment", "Cavendish Experiment", "Michelson-Morley Experiment", "Rutherford Gold Foil Experiment"],
                    correct_answer: "Young's Double-Slit Experiment",
                    explanation: "Thomas Young's double-slit experiment demonstrated interference patterns characteristic of wave-particle duality.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "qp-4",
                    question_text: "What fundamental constant connects the energy of a photon to its frequency (E = hf)?",
                    question_type: "multiple_choice",
                    options: ["Planck's Constant", "Boltzmann Constant", "Coulomb Constant", "Fine-Structure Constant"],
                    correct_answer: "Planck's Constant",
                    explanation: "Planck's constant (h ≈ 6.626 × 10⁻³⁴ J·s) is the fundamental physical constant that sets the scale of quantum mechanics.",
                    points: 100,
                    order_num: 4
                },
                {
                    id: "qp-5",
                    question_text: "What is the theoretical particle predicted to mediate the gravitational force in quantum field theories?",
                    question_type: "multiple_choice",
                    options: ["Graviton", "Higgs Boson", "Gluon", "Z Boson"],
                    correct_answer: "Graviton",
                    explanation: "The graviton is the hypothetical spin-2 elementary particle postulated to mediate gravity in quantum gravity frameworks.",
                    points: 150,
                    order_num: 5
                }
            ]
        },
        {
            id: "quiz-python-mastery",
            title: "Python & Data Structures Masterclass",
            slug: "python-data-structures-masterclass",
            category: "Academic & STEM",
            subcategory: "Computer Science",
            description: "Test your mastery over Python internals, generator pipelines, time complexities O(n), memory allocation, and concurrency models.",
            difficulty: "MASTER",
            duration_seconds: 300,
            questions_count: 5,
            backdrop_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
            is_trending: 1,
            is_top10: 1,
            top10_rank: 2,
            match_percentage: 98,
            author: "Guido Van Geek",
            tags: ["Python", "Algorithms", "Software Engineering", "Coding"],
            questions: [
                {
                    id: "py-1",
                    question_text: "What is the average time complexity for searching an element in a Python dictionary / hash table?",
                    question_type: "multiple_choice",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correct_answer: "O(1)",
                    explanation: "Python dictionaries are implemented as high-performance hash tables, offering O(1) average time complexity for key lookups and insertions.",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "py-2",
                    question_text: "Which mechanism prevents multiple native threads from executing Python bytecodes simultaneously in CPython?",
                    question_type: "multiple_choice",
                    options: ["GIL (Global Interpreter Lock)", "JIT Compiler", "Garbage Collector Mark-Sweep", "Thread Mutex Barrier"],
                    correct_answer: "GIL (Global Interpreter Lock)",
                    explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing CPython bytecode at once.",
                    points: 120,
                    order_num: 2
                },
                {
                    id: "py-3",
                    question_text: "What keyword transforms a regular Python function into a Generator that yields values lazily?",
                    question_type: "multiple_choice",
                    options: ["yield", "async", "return_lazy", "defer"],
                    correct_answer: "yield",
                    explanation: "Using 'yield' produces a generator object which pauses execution and maintains state across successive next() invocations.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "py-4",
                    question_text: "Which sorting algorithm is natively utilized by Python's list.sort() and sorted() built-ins?",
                    question_type: "multiple_choice",
                    options: ["Timsort", "QuickSort", "HeapSort", "MergeSort"],
                    correct_answer: "Timsort",
                    explanation: "Timsort is a hybrid stable sorting algorithm derived from merge sort and insertion sort, created by Tim Peters in 2002.",
                    points: 110,
                    order_num: 4
                },
                {
                    id: "py-5",
                    question_text: "What is the output of: `print([i*2 for i in range(4) if i % 2 == 0])`?",
                    question_type: "multiple_choice",
                    options: ["[0, 4]", "[0, 2, 4]", "[2, 6]", "[0, 2, 4, 6]"],
                    correct_answer: "[0, 4]",
                    explanation: "range(4) produces 0, 1, 2, 3. The even numbers are 0 and 2. Multiplying by 2 results in [0, 4].",
                    points: 100,
                    order_num: 5
                }
            ]
        },
        {
            id: "quiz-calculus-wonders",
            title: "Calculus & Infinite Dimensions",
            slug: "calculus-infinite-dimensions",
            category: "Academic & STEM",
            subcategory: "Mathematics",
            description: "Differential equations, Taylor series expansions, Stokes' theorem, and multivariable integrals for math enthusiasts.",
            difficulty: "HARD",
            duration_seconds: 300,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
            is_trending: 0,
            is_top10: 1,
            top10_rank: 3,
            match_percentage: 94,
            author: "Prof. Euler Newton",
            tags: ["Calculus", "Mathematics", "Analysis", "Geometry"],
            questions: [
                {
                    id: "calc-1",
                    question_text: "What is the derivative of f(x) = ln(3x² + 1) with respect to x?",
                    question_type: "multiple_choice",
                    options: ["6x / (3x² + 1)", "3x / (3x² + 1)", "1 / (6x)", "6 / (3x² + 1)"],
                    correct_answer: "6x / (3x² + 1)",
                    explanation: "By chain rule, d/dx[ln(u)] = u'/u. With u = 3x² + 1, u' = 6x, yielding 6x / (3x² + 1).",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "calc-2",
                    question_text: "What is the value of the limit: lim (x->0) [sin(x) / x]?",
                    question_type: "multiple_choice",
                    options: ["1", "0", "Infinity", "Undefined"],
                    correct_answer: "1",
                    explanation: "This fundamental trigonometric limit evaluates to 1, as proven by the Squeeze (Sandwich) Theorem or L'Hôpital's Rule.",
                    points: 100,
                    order_num: 2
                },
                {
                    id: "calc-3",
                    question_text: "Which fundamental theorem relates the surface integral of the curl of a vector field over an open surface to a line integral around its boundary?",
                    question_type: "multiple_choice",
                    options: ["Stokes' Theorem", "Divergence Theorem", "Green's Theorem in 1D", "Cauchy Integral Theorem"],
                    correct_answer: "Stokes' Theorem",
                    explanation: "Stokes' Theorem states that ∬_S (∇ × F) · dS = ∮_C F · dr for a smooth oriented surface S with boundary curve C.",
                    points: 150,
                    order_num: 3
                },
                {
                    id: "calc-4",
                    question_text: "What is the integral of e^(2x) dx?",
                    question_type: "multiple_choice",
                    options: ["(1/2)e^(2x) + C", "2e^(2x) + C", "e^(2x) + C", "(1/4)e^(2x) + C"],
                    correct_answer: "(1/2)e^(2x) + C",
                    explanation: "Using u-substitution u = 2x, du = 2 dx, the integral becomes (1/2)∫ e^u du = (1/2)e^(2x) + C.",
                    points: 100,
                    order_num: 4
                }
            ]
        },
        {
            id: "quiz-genetics-crispr",
            title: "Genetics, DNA & The CRISPR Revolution",
            slug: "genetics-dna-crispr-revolution",
            category: "Academic & STEM",
            subcategory: "Biology",
            description: "Explore DNA replication, transcription mechanisms, epigenetics, and gene editing breakthroughs rewriting biotechnology.",
            difficulty: "MEDIUM",
            duration_seconds: 240,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600&auto=format&fit=crop",
            is_trending: 1,
            is_top10: 1,
            top10_rank: 4,
            match_percentage: 96,
            author: "Dr. Jennifer Doudna Fan",
            tags: ["Biology", "Genetics", "CRISPR", "Medicine"],
            questions: [
                {
                    id: "gen-1",
                    question_text: "What does the molecular acronym 'CRISPR' stand for in genetic engineering?",
                    question_type: "multiple_choice",
                    options: [
                        "Clustered Regularly Interspaced Short Palindromic Repeats",
                        "Cellular RNA Induced Specific Protein Replicators",
                        "Chromosomal Recombinant Interspaced Sequence Polymorphism Recorders",
                        "Core RNA Interspaced Structural Polymorphic Regions"
                    ],
                    correct_answer: "Clustered Regularly Interspaced Short Palindromic Repeats",
                    explanation: "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats, an adaptive immune defense found in bacteria.",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "gen-2",
                    question_text: "Which nitrogenous base pairs with Adenine (A) in standard RNA molecules?",
                    question_type: "multiple_choice",
                    options: ["Uracil (U)", "Thymine (T)", "Cytosine (C)", "Guanine (G)"],
                    correct_answer: "Uracil (U)",
                    explanation: "In RNA, Uracil (U) replaces Thymine (T) and forms complementary base pairs with Adenine.",
                    points: 100,
                    order_num: 2
                },
                {
                    id: "gen-3",
                    question_text: "What enzyme is responsible for unwinding the double helix during DNA replication?",
                    question_type: "multiple_choice",
                    options: ["DNA Helicase", "DNA Polymerase", "DNA Ligase", "Topoisomerase"],
                    correct_answer: "DNA Helicase",
                    explanation: "DNA Helicase breaks the hydrogen bonds between nucleotide pairs, unwinding the double helix at the replication fork.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "gen-4",
                    question_text: "What is the powerhouse organelle of the eukaryotic cell containing its own distinct circular DNA?",
                    question_type: "multiple_choice",
                    options: ["Mitochondria", "Ribosome", "Endoplasmic Reticulum", "Golgi Apparatus"],
                    correct_answer: "Mitochondria",
                    explanation: "Mitochondria carry maternal circular mtDNA, supporting the endosymbiotic theory of cellular evolution.",
                    points: 100,
                    order_num: 4
                }
            ]
        },
        {
            id: "quiz-cybersecurity-defense",
            title: "Cybersecurity & Zero-Trust Defense",
            slug: "cybersecurity-zero-trust-defense",
            category: "Academic & STEM",
            subcategory: "Computer Science",
            description: "Master asymmetric cryptography, buffer overflow exploits, MITM attacks, zero-day vulnerabilities, and SOC defense tactics.",
            difficulty: "MASTER",
            duration_seconds: 300,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
            is_trending: 1,
            is_top10: 1,
            top10_rank: 5,
            match_percentage: 97,
            author: "RedTeam Elite",
            tags: ["Cybersecurity", "Network", "Cryptography", "Hacking"],
            questions: [
                {
                    id: "sec-1",
                    question_text: "What asymmetric encryption algorithm relies on the mathematical difficulty of factoring large prime numbers?",
                    question_type: "multiple_choice",
                    options: ["RSA", "AES-256", "SHA-3", "Blowfish"],
                    correct_answer: "RSA",
                    explanation: "RSA (Rivest–Shamir–Adleman) is an asymmetric public-key cryptosystem based on the practical difficulty of factoring large primes.",
                    points: 120,
                    order_num: 1
                },
                {
                    id: "sec-2",
                    question_text: "What core principle defines the Zero-Trust Architecture security model?",
                    question_type: "multiple_choice",
                    options: ["Never trust, always verify", "Trust internal network only", "Rely entirely on firewall perimeter", "Disable all user passwords"],
                    correct_answer: "Never trust, always verify",
                    explanation: "Zero Trust operates on the principle 'never trust, always verify', requiring strict continuous authentication regardless of network location.",
                    points: 100,
                    order_num: 2
                },
                {
                    id: "sec-3",
                    question_text: "Which vulnerability occurs when an application includes untrusted user input directly into a database command?",
                    question_type: "multiple_choice",
                    options: ["SQL Injection (SQLi)", "Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)", "Buffer Overflow"],
                    correct_answer: "SQL Injection (SQLi)",
                    explanation: "SQL Injection allows attackers to manipulate backend database queries by injecting unsanitized SQL statements.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "sec-4",
                    question_text: "What protocol secures HTTP traffic by utilizing Transport Layer Security (TLS)?",
                    question_type: "multiple_choice",
                    options: ["HTTPS (Port 443)", "SSH (Port 22)", "FTP (Port 21)", "SNMP (Port 161)"],
                    correct_answer: "HTTPS (Port 443)",
                    explanation: "HTTPS runs over TLS/SSL on port 443 to provide encryption, authentication, and data integrity over the web.",
                    points: 100,
                    order_num: 4
                }
            ]
        },
        {
            id: "quiz-ww2-history",
            title: "World War II: Turning Points & Strategies",
            slug: "world-war-ii-turning-points-strategies",
            category: "General Knowledge & History",
            subcategory: "World History",
            description: "Test your historical knowledge of Operation Overlord, the Battle of Stalingrad, codebreaking at Bletchley Park, and post-war treaties.",
            difficulty: "MEDIUM",
            duration_seconds: 300,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1578836537282-3171d77f8632?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
            is_trending: 0,
            is_top10: 1,
            top10_rank: 6,
            match_percentage: 92,
            author: "Churchill Archive",
            tags: ["History", "War", "20th Century", "Strategy"],
            questions: [
                {
                    id: "ww2-1",
                    question_text: "What was the official codename for the Allied amphibious invasion of Normandy on June 6, 1944 (D-Day)?",
                    question_type: "multiple_choice",
                    options: ["Operation Overlord", "Operation Barbarossa", "Operation Torch", "Operation Market Garden"],
                    correct_answer: "Operation Overlord",
                    explanation: "Operation Overlord was the Allied codename for the Battle of Normandy, the largest amphibious invasion in history.",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "ww2-2",
                    question_text: "Who led the British cryptanalysis team at Bletchley Park that deciphered the German Enigma cipher machine?",
                    question_type: "multiple_choice",
                    options: ["Alan Turing", "John von Neumann", "Claude Shannon", "Ada Lovelace"],
                    correct_answer: "Alan Turing",
                    explanation: "Alan Turing designed the electromechanical Bombe machine to break the German Enigma cipher at Bletchley Park.",
                    points: 120,
                    order_num: 2
                },
                {
                    id: "ww2-3",
                    question_text: "Which brutal Eastern Front conflict (1942-1943) marked the decisive turning point against Axis forces in Europe?",
                    question_type: "multiple_choice",
                    options: ["Battle of Stalingrad", "Battle of Kursk", "Siege of Leningrad", "Battle of Britain"],
                    correct_answer: "Battle of Stalingrad",
                    explanation: "The Soviet victory at Stalingrad resulted in the destruction of the German 6th Army and turned the tide on the Eastern Front.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "ww2-4",
                    question_text: "In which city was the post-war conference held in February 1945 by Roosevelt, Churchill, and Stalin?",
                    question_type: "multiple_choice",
                    options: ["Yalta", "Potsdam", "Tehran", "Geneva"],
                    correct_answer: "Yalta",
                    explanation: "The Yalta Conference was held in Crimea in February 1945 by the 'Big Three' leaders to discuss post-war European reorganization.",
                    points: 100,
                    order_num: 4
                }
            ]
        },
        {
            id: "quiz-astrophysics-space",
            title: "Cosmic Wonders: Astrophysics & Black Holes",
            slug: "cosmic-wonders-astrophysics-black-holes",
            category: "Academic & STEM",
            subcategory: "Astronomy",
            description: "Journey through event horizons, neutron stars, cosmic microwave background, and James Webb discoveries.",
            difficulty: "HARD",
            duration_seconds: 300,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
            is_trending: 1,
            is_top10: 1,
            top10_rank: 7,
            match_percentage: 95,
            author: "Carl Sagan Institute",
            tags: ["Space", "Astrophysics", "Black Holes", "NASA"],
            questions: [
                {
                    id: "sp-1",
                    question_text: "What is the boundary around a black hole beyond which no information or light can escape called?",
                    question_type: "multiple_choice",
                    options: ["Event Horizon", "Schwarzschild Photon Sphere", "Ergosphere", "Accretion Disk"],
                    correct_answer: "Event Horizon",
                    explanation: "The event horizon is the threshold where escape velocity equals the speed of light.",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "sp-2",
                    question_text: "What supermassive black hole lies at the center of our Milky Way galaxy?",
                    question_type: "multiple_choice",
                    options: ["Sagittarius A*", "Messier 87*", "Cygnus X-1", "Andromeda Prime"],
                    correct_answer: "Sagittarius A*",
                    explanation: "Sagittarius A* is the supermassive black hole located at the Galactic Center of the Milky Way, approximately 4.3 million solar masses.",
                    points: 110,
                    order_num: 2
                },
                {
                    id: "sp-3",
                    question_text: "What type of extremely dense stellar remnant forms when a massive star undergoes a core-collapse supernova without becoming a black hole?",
                    question_type: "multiple_choice",
                    options: ["Neutron Star / Pulsar", "White Dwarf", "Red Giant", "Brown Dwarf"],
                    correct_answer: "Neutron Star / Pulsar",
                    explanation: "Neutron stars are supported against gravitational collapse by neutron degeneracy pressure.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "sp-4",
                    question_text: "What space observatory launched on Christmas Day 2021 observes the universe primarily in Infrared?",
                    question_type: "multiple_choice",
                    options: ["James Webb Space Telescope (JWST)", "Hubble Space Telescope", "Chandra X-ray Observatory", "Spitzer Space Telescope"],
                    correct_answer: "James Webb Space Telescope (JWST)",
                    explanation: "The JWST operates at the Sun-Earth L2 Lagrange point, capturing infrared light from the earliest galaxies.",
                    points: 100,
                    order_num: 4
                }
            ]
        },
        {
            id: "quiz-cinema-classics",
            title: "Masterpieces of Cinema & Oscar Lore",
            slug: "masterpieces-of-cinema-oscar-lore",
            category: "General Knowledge & History",
            subcategory: "Pop Culture & Cinema",
            description: "Celebrate iconic film directors, cinematography, Oscar records, and legendary movie dialogues from world cinema.",
            difficulty: "EASY",
            duration_seconds: 240,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
            is_trending: 0,
            is_top10: 1,
            top10_rank: 8,
            match_percentage: 91,
            author: "Cinephile Vault",
            tags: ["Movies", "Hollywood", "Oscars", "Directors"],
            questions: [
                {
                    id: "cin-1",
                    question_text: "Which movie won 11 Academy Awards and holds the tie record for most Oscar wins with Titanic and Ben-Hur?",
                    question_type: "multiple_choice",
                    options: ["The Lord of the Rings: The Return of the King", "Avatar", "La La Land", "Oppenheimer"],
                    correct_answer: "The Lord of the Rings: The Return of the King",
                    explanation: "The Return of the King (2003) won all 11 Oscars it was nominated for, sweeping every category.",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "cin-2",
                    question_text: "Who directed the timeless cinematic masterpiece 'Pulp Fiction' (1994)?",
                    question_type: "multiple_choice",
                    options: ["Quentin Tarantino", "Martin Scorsese", "Steven Spielberg", "Christopher Nolan"],
                    correct_answer: "Quentin Tarantino",
                    explanation: "Quentin Tarantino wrote and directed Pulp Fiction, winning the Palme d'Or and the Academy Award for Best Original Screenplay.",
                    points: 100,
                    order_num: 2
                },
                {
                    id: "cin-3",
                    question_text: "What was the first feature-length animated movie released by Walt Disney in 1937?",
                    question_type: "multiple_choice",
                    options: ["Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Bambi"],
                    correct_answer: "Snow White and the Seven Dwarfs",
                    explanation: "Snow White and the Seven Dwarfs was the world's first full-length cel-animated feature film in Technicolor.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "cin-4",
                    question_text: "Which South Korean film made history in 2020 by becoming the first non-English language movie to win Best Picture?",
                    question_type: "multiple_choice",
                    options: ["Parasite", "Train to Busan", "Oldboy", "The Handmaiden"],
                    correct_answer: "Parasite",
                    explanation: "Bong Joon-ho's 'Parasite' won 4 Oscars including Best Picture, Best Director, and Best International Feature.",
                    points: 100,
                    order_num: 4
                }
            ]
        },
        {
            id: "quiz-speed-blitz-trivia",
            title: "Speed Blitz: 5-Minute Brain Teasers",
            slug: "speed-blitz-5-minute-brain-teasers",
            category: "Quick Blitz (5-Min)",
            subcategory: "Logic & Trivia",
            description: "Fast-paced logic, rapid trivia, lateral thinking puzzles, and lightning rounds to test your reflex and quick deduction.",
            difficulty: "EASY",
            duration_seconds: 180,
            questions_count: 4,
            backdrop_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
            poster_url: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=600&auto=format&fit=crop",
            is_trending: 1,
            is_top10: 0,
            top10_rank: 0,
            match_percentage: 99,
            author: "Blitz Masters",
            tags: ["Quick", "Blitz", "Logic", "Riddles"],
            questions: [
                {
                    id: "blitz-1",
                    question_text: "If a plane crashes exactly on the border between the United States and Canada, where do they bury the survivors?",
                    question_type: "multiple_choice",
                    options: ["You don't bury survivors!", "United States", "Canada", "In international waters"],
                    correct_answer: "You don't bury survivors!",
                    explanation: "Survivors are alive, so they are not buried!",
                    points: 100,
                    order_num: 1
                },
                {
                    id: "blitz-2",
                    question_text: "How many seconds are in one full hour?",
                    question_type: "multiple_choice",
                    options: ["3,600 seconds", "600 seconds", "36,000 seconds", "1,800 seconds"],
                    correct_answer: "3,600 seconds",
                    explanation: "60 seconds per minute × 60 minutes per hour = 3,600 seconds.",
                    points: 100,
                    order_num: 2
                },
                {
                    id: "blitz-3",
                    question_text: "Which chemical element has the highest thermal and electrical conductivity of all metals?",
                    question_type: "multiple_choice",
                    options: ["Silver (Ag)", "Copper (Cu)", "Gold (Au)", "Aluminum (Al)"],
                    correct_answer: "Silver (Ag)",
                    explanation: "Silver has the highest electrical and thermal conductivity of any known metal.",
                    points: 100,
                    order_num: 3
                },
                {
                    id: "blitz-4",
                    question_text: "What word is always spelled incorrectly in every dictionary?",
                    question_type: "multiple_choice",
                    options: ["'Incorrectly'", "'Misspelled'", "'Dictionary'", "'Phonetic'"],
                    correct_answer: "'Incorrectly'",
                    explanation: "The word 'incorrectly' is always spelled I-N-C-O-R-R-E-C-T-L-Y!",
                    points: 100,
                    order_num: 4
                }
            ]
        }
    ];

    // In-memory/localStorage stores for fallback
    let localProfiles = JSON.parse(localStorage.getItem("quizflix_local_profiles") || "null") || [
        { id: "prof-1", name: "Alex Quantum", avatar: "avatar-red", has_pin: false, is_kids: 0, color_theme: "#E50914" },
        { id: "prof-2", name: "Elena Code", avatar: "avatar-blue", has_pin: true, is_kids: 0, color_theme: "#0080FF", pin: "1337" },
        { id: "prof-3", name: "Marcus History", avatar: "avatar-yellow", has_pin: false, is_kids: 0, color_theme: "#E5A914" },
        { id: "prof-4", name: "Sophie Explorer", avatar: "avatar-green", has_pin: false, is_kids: 1, color_theme: "#2ECC71" },
        { id: "prof-5", name: "Nova Stellar", avatar: "avatar-purple", has_pin: true, is_kids: 0, color_theme: "#9B59B6", pin: "2026" }
    ];

    let localBookmarks = JSON.parse(localStorage.getItem("quizflix_local_bookmarks") || '{"prof-1": ["quiz-quantum-physics", "quiz-python-mastery", "quiz-astrophysics-space"]}');
    let localProgress = JSON.parse(localStorage.getItem("quizflix_local_progress") || '{"prof-1": [{"quiz_id": "quiz-quantum-physics", "title": "Quantum Realm & Theoretical Physics", "category": "Academic & STEM", "difficulty": "HARD", "backdrop_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop", "current_question_index": 2, "total_questions": 5, "time_elapsed": 78, "time_remaining": 282, "selected_answers": {"qp-1": "Position and Momentum", "qp-2": "Quantum Entanglement"}}]}');
    let localHistory = JSON.parse(localStorage.getItem("quizflix_local_history") || '{"prof-1": [{"id": "h-1", "quiz_id": "quiz-quantum-physics", "title": "Quantum Realm & Theoretical Physics", "category": "Academic & STEM", "subcategory": "Physics", "score": 570, "max_score": 570, "percentage": 100, "correct_count": 5, "total_questions": 5, "time_spent_seconds": 142, "completed_at": "2026-08-25 08:30"}]}');

    function saveLocal() {
        localStorage.setItem("quizflix_local_profiles", JSON.stringify(localProfiles));
        localStorage.setItem("quizflix_local_bookmarks", JSON.stringify(localBookmarks));
        localStorage.setItem("quizflix_local_progress", JSON.stringify(localProgress));
        localStorage.setItem("quizflix_local_history", JSON.stringify(localHistory));
    }

    // Generic Fetcher with Fallback
    async function apiFetch(endpoint, options = {}) {
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                headers: { "Content-Type": "application/json" },
                ...options
            });
            if (!res.ok && res.status !== 401) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn(`[QUIZFLIX Data] Falling back to local store for ${endpoint}:`, err.message);
            return null;
        }
    }

    return {
        // Profiles
        async getProfiles() {
            const res = await apiFetch("/profiles");
            if (res && res.success) return res.profiles;
            return localProfiles.map(p => ({ ...p, pin: undefined, has_pin: Boolean(p.pin || p.has_pin) }));
        },

        async saveProfile(profileData) {
            const res = await apiFetch("/profiles", {
                method: "POST",
                body: JSON.stringify(profileData)
            });
            if (res && res.success) return res.profile;

            // Fallback
            let existingIdx = localProfiles.findIndex(p => p.id === profileData.id);
            if (existingIdx >= 0) {
                localProfiles[existingIdx] = { ...localProfiles[existingIdx], ...profileData, has_pin: Boolean(profileData.pin) };
            } else {
                if (localProfiles.length >= 5) throw new Error("Maximum 5 profiles reached");
                const newProfile = { ...profileData, id: `prof-${Date.now()}`, has_pin: Boolean(profileData.pin) };
                localProfiles.push(newProfile);
            }
            saveLocal();
            return profileData;
        },

        async verifyPin(profileId, pin) {
            const res = await apiFetch("/profiles/verify-pin", {
                method: "POST",
                body: JSON.stringify({ profile_id: profileId, pin })
            });
            if (res) return res.verified;

            // Fallback
            const prof = localProfiles.find(p => p.id === profileId);
            if (!prof || !prof.pin) return true;
            return String(prof.pin).trim() === String(pin).trim();
        },

        async deleteProfile(profileId) {
            const res = await apiFetch(`/profiles/${profileId}`, { method: "DELETE" });
            if (res && res.success) return true;

            localProfiles = localProfiles.filter(p => p.id !== profileId);
            saveLocal();
            return true;
        },

        // Quizzes
        async getQuizzes(category = null) {
            const endpoint = category && category !== "all" ? `/quizzes?category=${encodeURIComponent(category)}` : "/quizzes";
            const res = await apiFetch(endpoint);
            if (res && res.success) return res.quizzes;

            if (category && category !== "all") {
                return FALLBACK_QUIZZES.filter(q => q.category.toLowerCase() === category.toLowerCase());
            }
            return FALLBACK_QUIZZES;
        },

        async getQuizById(quizId) {
            const res = await apiFetch(`/quizzes/${quizId}`);
            if (res && res.success) return res.quiz;
            return FALLBACK_QUIZZES.find(q => q.id === quizId) || null;
        },

        async getBillboard() {
            const res = await apiFetch("/billboard");
            if (res && res.success && res.billboard) return res.billboard;
            return {
                ...FALLBACK_QUIZZES[0],
                top_score: 570,
                top_scorer_name: "Alex Quantum"
            };
        },

        // Continue Watching / In-Progress
        async getContinueWatching(profileId) {
            const res = await apiFetch(`/progress/${profileId}`);
            if (res && res.success) return res.items;
            return localProgress[profileId] || [];
        },

        async saveProgress(progressData) {
            const res = await apiFetch("/progress", {
                method: "POST",
                body: JSON.stringify(progressData)
            });
            if (res && res.success) return true;

            // Fallback
            const pId = progressData.profile_id;
            if (!localProgress[pId]) localProgress[pId] = [];
            const quiz = FALLBACK_QUIZZES.find(q => q.id === progressData.quiz_id);
            
            const existingIdx = localProgress[pId].findIndex(i => i.quiz_id === progressData.quiz_id);
            const itemData = {
                ...progressData,
                title: quiz ? quiz.title : "Quiz",
                category: quiz ? quiz.category : "Academic",
                difficulty: quiz ? quiz.difficulty : "MEDIUM",
                backdrop_url: quiz ? quiz.backdrop_url : "",
                last_updated: new Date().toISOString()
            };

            if (existingIdx >= 0) {
                localProgress[pId][existingIdx] = itemData;
            } else {
                localProgress[pId].unshift(itemData);
            }
            saveLocal();
            return true;
        },

        async deleteProgress(profileId, quizId) {
            await apiFetch(`/progress/${profileId}/${quizId}`, { method: "DELETE" });
            if (localProgress[profileId]) {
                localProgress[profileId] = localProgress[profileId].filter(i => i.quiz_id !== quizId);
                saveLocal();
            }
        },

        // Bookmarks (My Quiz)
        async getBookmarks(profileId) {
            const res = await apiFetch(`/bookmarks/${profileId}`);
            if (res && res.success) return res.bookmarks;

            const ids = localBookmarks[profileId] || [];
            return FALLBACK_QUIZZES.filter(q => ids.includes(q.id));
        },

        async toggleBookmark(profileId, quizId) {
            const res = await apiFetch("/bookmarks/toggle", {
                method: "POST",
                body: JSON.stringify({ profile_id: profileId, quiz_id: quizId })
            });
            if (res && res.success) return res.is_bookmarked;

            if (!localBookmarks[profileId]) localBookmarks[profileId] = [];
            const idx = localBookmarks[profileId].indexOf(quizId);
            let isBookmarked = false;
            if (idx >= 0) {
                localBookmarks[profileId].splice(idx, 1);
                isBookmarked = false;
            } else {
                localBookmarks[profileId].push(quizId);
                isBookmarked = true;
            }
            saveLocal();
            return isBookmarked;
        },

        // History & Leaderboard
        async recordHistory(historyData) {
            await apiFetch("/history", {
                method: "POST",
                body: JSON.stringify(historyData)
            });

            // Fallback
            const pId = historyData.profile_id;
            if (!localHistory[pId]) localHistory[pId] = [];
            const quiz = FALLBACK_QUIZZES.find(q => q.id === historyData.quiz_id);

            localHistory[pId].unshift({
                ...historyData,
                id: `hist-${Date.now()}`,
                title: quiz ? quiz.title : "Quiz",
                category: quiz ? quiz.category : "Academic",
                subcategory: quiz ? quiz.subcategory : "STEM",
                completed_at: new Date().toLocaleString()
            });

            if (localProgress[pId]) {
                localProgress[pId] = localProgress[pId].filter(i => i.quiz_id !== historyData.quiz_id);
            }
            saveLocal();
        },

        async getProfileHistory(profileId) {
            const res = await apiFetch(`/history/${profileId}`);
            if (res && res.success) return res.history;
            return localHistory[profileId] || [];
        },

        async getLeaderboard(quizId = null) {
            const res = await apiFetch(`/leaderboard${quizId ? `?quiz_id=${quizId}` : ''}`);
            if (res && res.success) return res.leaderboard;

            return [
                { profile_name: "Alex Quantum", avatar: "avatar-red", quiz_title: "Quantum Realm & Theoretical Physics", category: "Academic & STEM", score: 570, percentage: 100, time_spent_seconds: 142, completed_at: "2026-08-25" },
                { profile_name: "Elena Code", avatar: "avatar-blue", quiz_title: "Python & Data Structures Masterclass", category: "Academic & STEM", score: 530, percentage: 100, time_spent_seconds: 118, completed_at: "2026-08-25" },
                { profile_name: "Marcus History", avatar: "avatar-yellow", quiz_title: "World War II: Turning Points", category: "General Knowledge", score: 420, percentage: 100, time_spent_seconds: 160, completed_at: "2026-08-24" },
                { profile_name: "Nova Stellar", avatar: "avatar-purple", quiz_title: "Cosmic Wonders: Astrophysics", category: "Academic & STEM", score: 410, percentage: 100, time_spent_seconds: 125, completed_at: "2026-08-24" },
                { profile_name: "Sophie Explorer", avatar: "avatar-green", quiz_title: "Speed Blitz: 5-Minute Brain Teasers", category: "Quick Blitz", score: 400, percentage: 100, time_spent_seconds: 90, completed_at: "2026-08-25" }
            ];
        }
    };
})();
