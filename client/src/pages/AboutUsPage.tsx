import { CompanyNav } from "@/components/CompanyNav";
import { CompanyFooter } from "@/components/CompanyFooter";
import { TaxiLogo } from "@/components/TaxiLogo";
import {
  MapPin,
  Phone,
  UserCheck,
  Users,
  Filter,
  RefreshCw,
  ArrowRight,
  ArrowDown,
  Navigation,
  Clock,
  CheckSquare,
} from "lucide-react";

import heroImg from "@assets/4ACnycvj_1771051965567.png";
import whoWeAreImg from "@assets/ahE4xJgt_1771051965567.png";
import mapFilteringImg from "@assets/JYSc8ohr_1771051965567.png";

const YELLOW = "#FFDD00";
const BLACK = "#1a1a1a";

const WORKFLOW_STEPS = [
  { title: "CUSTOMER INFO", desc: "Name, phone, address" },
  { title: "PIN PREVIEW", desc: "Map preview of location" },
  { title: "DROP PIN", desc: "Confirm pickup point" },
  { title: "ASSIGN DRIVER", desc: "Select from dropdown" },
  { title: "PICKED UP", desc: "Mark complete" },
  { title: "REVENUE LOGGED", desc: "Fare tracked" },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      <CompanyNav />

      {/* HERO */}
      <section
        id="hero"
        className="py-16 md:py-24"
        style={{ backgroundColor: YELLOW, color: BLACK }}
        data-testid="section-hero"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-4"
              data-testid="text-hero-title"
            >
              DENOKO TAXI
            </h1>
            <p
              className="text-xl md:text-2xl font-black tracking-tight mb-4"
              data-testid="text-hero-subtitle"
            >
              Hybrid Dispatch. Real-Time Control.
            </p>
            <p
              className="text-base md:text-lg max-w-xl mb-12 opacity-80"
              data-testid="text-hero-description"
            >
              Live coordination between dispatchers and drivers — built for
              cooperatives that move fast.
            </p>
            <div className="w-full max-w-4xl border-4 border-black">
              <img
                src={heroImg}
                alt="Denoko Taxi Dashboard"
                className="w-full"
                data-testid="img-hero-dashboard"
              />
            </div>
            <div className="flex justify-between gap-4 w-full max-w-4xl mt-8">
              <a
                href="#who-we-are"
                className="font-black text-sm tracking-tight hover:underline"
                data-testid="link-who-we-are"
              >
                WHO WE ARE
              </a>
              <a
                href="#driver-mode"
                className="font-black text-sm tracking-tight hover:underline"
                data-testid="link-how-it-works"
              >
                HOW IT WORKS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1" style={{ backgroundColor: BLACK }} />

      {/* WHO WE ARE */}
      <section
        id="who-we-are"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-who-we-are"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-6"
                style={{ backgroundColor: BLACK, color: "#fff" }}
                data-testid="badge-who-we-are"
              >
                WHO WE ARE
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6"
                data-testid="text-who-we-are-title"
              >
                DISPATCH BUILT
                <br />
                FOR THE REAL WORLD
              </h2>
              <p className="text-base md:text-lg mb-6">
                A hybrid taxi dispatch system for companies that rely on live
                coordination — not guesswork.
              </p>
              <ul className="space-y-2 mb-6 text-base">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Dispatchers get full visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Drivers get simple GPS tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Companies get organized call management</span>
                </li>
              </ul>
            </div>
            <div className="border-4 border-black">
              <img
                src={whoWeAreImg}
                alt="Denoko Taxi Dispatch Overview"
                className="w-full"
                data-testid="img-who-we-are"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TWO MODES */}
      <section
        id="platform"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", color: BLACK }}
        data-testid="section-platform"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
              data-testid="badge-platform"
            >
              THE PLATFORM
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
              data-testid="text-platform-title"
            >
              TWO MODES. ONE SYSTEM.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Driver Mode Card */}
            <div>
              <div
                className="border-4 p-6 md:p-8"
                style={{ backgroundColor: YELLOW, borderColor: BLACK }}
                data-testid="card-driver-mode"
              >
                <h3 className="text-3xl md:text-4xl font-black mb-6">
                  DRIVER
                </h3>
                <div
                  className="p-4 mb-4 border-2"
                  style={{ borderColor: BLACK, backgroundColor: "#fff" }}
                >
                  <p className="font-mono text-sm mb-1">
                    <span className="font-black">Dispatch Code:</span>{" "}
                    NYAC-TAXI-01
                  </p>
                  <p className="font-mono text-sm mb-1">
                    <span className="font-black">Status:</span> SHARING
                  </p>
                  <p className="font-mono text-sm">
                    <span className="font-black">Last Update:</span> 12:41:05
                  </p>
                </div>
                <button
                  className="w-full py-3 font-black text-sm tracking-wider border-2"
                  style={{
                    backgroundColor: BLACK,
                    color: YELLOW,
                    borderColor: BLACK,
                  }}
                  data-testid="button-stop-sharing"
                >
                  STOP SHARING
                </button>
              </div>
              <div className="mt-4">
                <h4
                  className="text-lg font-black mb-1"
                  data-testid="text-for-drivers"
                >
                  FOR DRIVERS
                </h4>
                <p className="text-sm">
                  Open. Enter code. Start sharing. That's it.
                </p>
              </div>
            </div>
            {/* Dispatch Mode Card */}
            <div>
              <div
                className="border-4 p-6 md:p-8"
                style={{ backgroundColor: YELLOW, borderColor: BLACK }}
                data-testid="card-dispatch-mode"
              >
                <h3 className="text-3xl md:text-4xl font-black mb-6">
                  DISPATCH
                </h3>
                <div
                  className="p-4 border-2 space-y-2"
                  style={{ borderColor: BLACK, backgroundColor: "#fff" }}
                >
                  <div className="flex gap-2">
                    <div
                      className="flex-1 h-20 border"
                      style={{ borderColor: BLACK }}
                    >
                      <div
                        className="h-4 w-full"
                        style={{ backgroundColor: BLACK }}
                      />
                      <p className="text-[10px] font-black p-1 text-center">
                        MAP VIEW
                      </p>
                    </div>
                    <div className="w-1/3 space-y-1">
                      <div
                        className="h-6 border text-[8px] font-black flex items-center px-1"
                        style={{ borderColor: BLACK }}
                      >
                        CALLS
                      </div>
                      <div
                        className="h-6 border text-[8px] font-black flex items-center px-1"
                        style={{ borderColor: BLACK }}
                      >
                        DRIVERS
                      </div>
                      <div
                        className="h-6 border text-[8px] font-black flex items-center px-1"
                        style={{ borderColor: BLACK }}
                      >
                        STATS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4
                  className="text-lg font-black mb-1"
                  data-testid="text-for-dispatchers"
                >
                  FOR DISPATCHERS
                </h4>
                <p className="text-sm">
                  Live map. Organized calls. Complete control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1" style={{ backgroundColor: YELLOW }} />

      {/* HOW IT WORKS — DRIVER MODE */}
      <section
        id="driver-mode"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-driver-mode"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
            >
              HOW IT WORKS
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              data-testid="text-driver-mode-title"
            >
              DRIVER MODE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "ENTER DISPATCH CODE",
                desc: "Name + group code. No friction.",
              },
              {
                num: "02",
                title: "START SHARING",
                desc: "One tap. GPS updates every 5 seconds.",
              },
              {
                num: "03",
                title: "APPEAR ON MAP",
                desc: "Dispatcher sees you live. Status updates automatically.",
              },
              {
                num: "04",
                title: "COMPLETE TRIPS",
                desc: "Receive assignments. Mark complete. Revenue tracked.",
              },
            ].map((card) => (
              <div
                key={card.num}
                className="border-4 p-6 md:p-8"
                style={{ backgroundColor: YELLOW, borderColor: BLACK }}
                data-testid={`card-driver-step-${card.num}`}
              >
                <span className="text-5xl md:text-6xl font-black opacity-30">
                  {card.num}
                </span>
                <h3 className="text-xl font-black mt-2 mb-2">{card.title}</h3>
                <p className="text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — DISPATCH MODE */}
      <section
        id="dispatch-mode"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", color: BLACK }}
        data-testid="section-dispatch-mode"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
            >
              HOW IT WORKS
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              data-testid="text-dispatch-mode-title"
            >
              DISPATCH MODE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  num: "01",
                  title: "SECURE LOGIN",
                  desc: "Passcode + dispatch code",
                  dark: true,
                },
                {
                  num: "02",
                  title: "LIVE MAP",
                  desc: "All drivers, real time",
                  dark: false,
                },
                {
                  num: "03",
                  title: "CREATE CALLS",
                  desc: "Name, phone, address, fare",
                  dark: false,
                },
                {
                  num: "04",
                  title: "ASSIGN DRIVERS",
                  desc: "Dropdown selection",
                  dark: true,
                },
                {
                  num: "05",
                  title: "MARK PICKED UP",
                  desc: "Call turns green",
                  dark: false,
                },
                {
                  num: "06",
                  title: "TRACK STATS",
                  desc: "Calls, revenue, driver performance",
                  dark: true,
                },
              ].map((card) => (
                <div
                  key={card.num}
                  className="border-4 p-4 md:p-6"
                  style={{
                    backgroundColor: card.dark ? BLACK : YELLOW,
                    borderColor: BLACK,
                    color: card.dark ? YELLOW : BLACK,
                  }}
                  data-testid={`card-dispatch-step-${card.num}`}
                >
                  <span className="text-3xl font-black opacity-40">
                    {card.num}
                  </span>
                  <h3 className="text-sm font-black mt-2 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs opacity-80">{card.desc}</p>
                </div>
              ))}
            </div>
            <div className="border-4 border-black">
              <img
                src={heroImg}
                alt="Dispatch Dashboard"
                className="w-full"
                data-testid="img-dispatch-dashboard"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1" style={{ backgroundColor: BLACK }} />

      {/* FEATURES */}
      <section
        id="features"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-features"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
            >
              CAPABILITIES
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              data-testid="text-features-title"
            >
              POWERFUL FEATURES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: MapPin,
                title: "LIVE GPS TRACKING",
                desc: "5-second GPS updates. Always know where your fleet is.",
              },
              {
                num: "02",
                icon: Phone,
                title: "ORGANIZED CALLS",
                desc: "Yellow pins for active. Green for completed. Zero chaos.",
              },
              {
                num: "03",
                icon: UserCheck,
                title: "DRIVER STATUS",
                desc: "LIVE or OFFLINE — 15-second threshold. Instant clarity.",
              },
              {
                num: "04",
                icon: Users,
                title: "CALL ASSIGNMENT",
                desc: "Assign drivers. Mark picked up. Track every fare.",
              },
              {
                num: "05",
                icon: Filter,
                title: "SMART FILTERING",
                desc: "By day, week, month, year, or custom range. Server-side fast.",
              },
              {
                num: "06",
                icon: RefreshCw,
                title: "AUTO-REFRESH",
                desc: "Dashboard updates every 3 seconds. No manual refresh.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.num}
                  className="border-4 p-6"
                  style={{ backgroundColor: YELLOW, borderColor: BLACK }}
                  data-testid={`card-feature-${feature.num}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-black opacity-30">
                      {feature.num}
                    </span>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black mb-2">{feature.title}</h3>
                  <p className="text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL WORKFLOW */}
      <section
        id="workflow"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", color: BLACK }}
        data-testid="section-workflow"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
            >
              PROCESS
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              data-testid="text-workflow-title"
            >
              CALL WORKFLOW
            </h2>
          </div>
          {/* Desktop: horizontal flow */}
          <div className="hidden md:flex items-start justify-center gap-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.title} className="flex items-center gap-2">
                <div
                  className="p-4 min-w-[130px] text-center"
                  style={{
                    backgroundColor: YELLOW,
                    borderColor: BLACK,
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  data-testid={`card-workflow-step-${i + 1}`}
                >
                  <h4 className="text-xs font-black mb-1">{step.title}</h4>
                  <p className="text-[10px]">{step.desc}</p>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          {/* Mobile: vertical flow */}
          <div className="flex md:hidden flex-col items-center gap-2">
            {WORKFLOW_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="p-4 w-full max-w-xs text-center"
                  style={{
                    backgroundColor: YELLOW,
                    borderColor: BLACK,
                    borderWidth: "3px",
                    borderStyle: "solid",
                  }}
                  data-testid={`card-workflow-mobile-step-${i + 1}`}
                >
                  <h4 className="text-xs font-black mb-1">{step.title}</h4>
                  <p className="text-[10px]">{step.desc}</p>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <ArrowDown className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1" style={{ backgroundColor: YELLOW }} />

      {/* MAP & FILTERING */}
      <section
        id="map-filtering"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-map-filtering"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
                style={{ backgroundColor: BLACK, color: "#fff" }}
                data-testid="badge-features"
              >
                FEATURES
              </span>
              <h2
                className="text-4xl md:text-5xl font-black tracking-tight mb-6"
                data-testid="text-map-filtering-title"
              >
                MAP & FILTERING
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: YELLOW }} />
                  <span><strong>Yellow pins</strong> = Active calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span><strong>Green pins</strong> = Completed calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <Filter className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Filter by:</strong> Today, 7/30 days, 6/12 months, All Time, or Custom</span>
                </li>
                <li className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Auto-refresh every 3 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>LIVE/OFFLINE status — 15-second threshold</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Last Seen updates every second</span>
                </li>
              </ul>
            </div>
            <div className="border-4 border-black">
              <img
                src={mapFilteringImg}
                alt="Map and Filtering Interface"
                className="w-full"
                data-testid="img-map-filtering"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section
        id="tech-stack"
        className="py-16 md:py-24"
        style={{ backgroundColor: BLACK, color: "#fff" }}
        data-testid="section-tech-stack"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-12"
            style={{ color: YELLOW }}
            data-testid="text-tech-stack-title"
          >
            BUILT FOR PERFORMANCE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              {[
                { label: "Frontend", value: "React + TypeScript + Tailwind CSS" },
                { label: "Backend", value: "Express.js (Node.js)" },
                { label: "Database", value: "PostgreSQL + Drizzle ORM" },
                { label: "Maps", value: "Mapbox GL JS" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span
                    className="inline-block px-3 py-1 text-xs font-black tracking-wider flex-shrink-0"
                    style={{ backgroundColor: YELLOW, color: BLACK }}
                    data-testid={`badge-tech-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </span>
                  <span className="text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <div>
              <h3
                className="text-lg font-black mb-4"
                style={{ color: YELLOW }}
              >
                ARCHITECTURE
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: YELLOW }} />
                  <span>Live polling (3-second intervals)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: YELLOW }} />
                  <span>Ephemeral in-memory driver GPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: YELLOW }} />
                  <span>Persistent call records in PostgreSQL</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1" style={{ backgroundColor: YELLOW }} />

      {/* COOPERATIVE — SINGLE MERGED SECTION */}
      <section
        id="cooperative"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-cooperative"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="mb-6" data-testid="cooperative-logo">
              <TaxiLogo size="lg" />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6"
              data-testid="text-cooperative-title"
            >
              THE DENOKO COOPERATIVE
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto">
              Technology that empowers workers, not replaces them. Enterprise-level
              tools without losing the human connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div
              id="cooperative-mission"
              data-testid="section-cooperative-mission"
            >
              <h3 className="text-lg font-black mb-4">WE BELIEVE</h3>
              <ul className="space-y-3 text-base">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Drivers deserve clarity, not chaos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Dispatchers deserve visibility, not guesswork</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Taxi companies deserve systems, not spreadsheets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Communities deserve cooperative ownership</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-black mb-4 italic">OUR ETHOS</h3>
              <ul className="space-y-3 text-base italic">
                <li>Technology should serve people.</li>
                <li>Organization creates opportunity.</li>
                <li>Ownership builds generational strength.</li>
              </ul>
              <p className="text-xl md:text-2xl font-black mt-8">
                Building the future of work, together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", color: BLACK }}
        data-testid="section-testimonials"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
            >
              SOCIAL PROOF
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              data-testid="text-testimonials-title"
            >
              TRUSTED BY TAXI COOPERATIVES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                company: "NYC Taxi Cooperative",
                quote:
                  "A dispatch system that doesn't overcomplicate things. Our drivers love the simplicity.",
              },
              {
                company: "Chicago Metro Cabs",
                quote:
                  "We know exactly where every driver is. That visibility changed everything.",
              },
              {
                company: "Bay Area Taxi Alliance",
                quote:
                  "No more radio chaos. Clear assignments, better revenue.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.company}
                className="p-6 md:p-8"
                style={{ border: `4px double ${BLACK}` }}
                data-testid={`card-testimonial-${testimonial.company.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <p className="text-sm mb-6 italic">"{testimonial.quote}"</p>
                <p className="text-sm font-black">{testimonial.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-1" style={{ backgroundColor: BLACK }} />

      {/* PRICING */}
      <section
        id="pricing"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-pricing"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1 text-xs font-black tracking-wider mb-4"
              style={{ backgroundColor: BLACK, color: "#fff" }}
            >
              PLANS
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
              data-testid="text-pricing-title"
            >
              SIMPLE PRICING
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Starter Plan */}
            <div
              className="border-4 p-6 md:p-8"
              style={{ backgroundColor: YELLOW, borderColor: BLACK }}
              data-testid="card-pricing-starter"
            >
              <h3 className="text-2xl font-black mb-2">STARTER</h3>
              <p className="text-4xl md:text-5xl font-black mb-1">$49</p>
              <p className="text-sm font-black mb-6">/month</p>
              <ul className="space-y-2 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" />
                  Up to 10 drivers
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" />
                  Unlimited calls
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" />
                  Real-time GPS
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" />
                  Email support
                </li>
              </ul>
              <button
                className="w-full py-3 font-black text-sm tracking-wider"
                style={{ backgroundColor: BLACK, color: YELLOW }}
                data-testid="button-start-trial"
              >
                START TRIAL
              </button>
            </div>
            {/* Professional Plan */}
            <div
              className="border-4 p-6 md:p-8"
              style={{
                backgroundColor: BLACK,
                borderColor: BLACK,
                color: "#fff",
              }}
              data-testid="card-pricing-professional"
            >
              <h3 className="text-2xl font-black mb-2" style={{ color: YELLOW }}>
                PROFESSIONAL
              </h3>
              <p className="text-4xl md:text-5xl font-black mb-1">$99</p>
              <p className="text-sm font-black mb-6">/month</p>
              <ul className="space-y-2 text-sm mb-8">
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
                  Unlimited drivers
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
                  Custom dispatch codes
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
                  Phone support
                </li>
              </ul>
              <button
                className="w-full py-3 font-black text-sm tracking-wider"
                style={{ backgroundColor: YELLOW, color: BLACK }}
                data-testid="button-contact-sales"
              >
                CONTACT SALES
              </button>
            </div>
          </div>
          <p className="text-center text-sm italic mt-8">
            14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
}
