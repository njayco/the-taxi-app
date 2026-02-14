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
import callWorkflowImg from "@assets/8chqOvTt_1771051965567.png";
import whoWeAreImg from "@assets/ahE4xJgt_1771051965567.png";
import pricingImg from "@assets/BdU3jBsq_1771051965567.png";
import twoModesImg from "@assets/cKRs47aY_1771051965567.png";
import testimonialsImg from "@assets/fgWHmhEn_1771051965567.png";
import mobileHeroImg from "@assets/gbzF1qeh_1771051965567.png";
import featuresGridImg from "@assets/KJd2C8KX_1771051965567.png";
import driverModeImg from "@assets/rkPWp6TO_1771051965567.png";
import dispatchModeImg from "@assets/ZMyAnbyB_1771051965567.png";
import mapFilteringImg from "@assets/JYSc8ohr_1771051965567.png";
import techStackImg from "@assets/i5s0HwDz_1771051965567.png";
import cooperativeImg from "@assets/zMkSVlLZ_1771051965567.png";
import cooperativeYellowImg from "@assets/yyBUKLte_1771051965567.png";
import ctaImg from "@assets/wzOf4mLm_1771051965567.png";

const YELLOW = "#FFDD00";
const BLACK = "#1a1a1a";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      <CompanyNav />

      {/* HERO SECTION */}
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
              className="text-base md:text-lg max-w-2xl mb-12"
              data-testid="text-hero-description"
            >
              A live taxi dispatch platform built for dispatchers and drivers to
              operate smarter, faster, and more efficiently.
            </p>
            <div className="w-full max-w-4xl border-4 border-black">
              <img
                src={heroImg}
                alt="Denoko Taxi Dashboard Wireframe"
                className="w-full"
                data-testid="img-hero-dashboard"
              />
            </div>
            <div className="flex justify-between w-full max-w-4xl mt-8">
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

      {/* WHO WE ARE SECTION */}
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
                DENOKO TAXI DISPATCH
              </h2>
              <p className="text-base md:text-lg mb-6">
                Denoko Taxi Dispatch is a hybrid taxi dispatch system built for
                real-world taxi companies that rely on live coordination between
                dispatchers and drivers.
              </p>
              <p className="font-black text-sm mb-3">We empower:</p>
              <ul className="space-y-2 mb-6 text-base">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Dispatchers with real-time visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Drivers with simple GPS sharing tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    Taxi companies with structured, organized call management
                  </span>
                </li>
              </ul>
              <p className="text-base">
                Denoko Taxi is built under the Denoko Cooperative — a
                mission-driven organization focused on economic empowerment,
                ownership, and operational excellence.
              </p>
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

      {/* TWO MODES SECTION */}
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
                style={{
                  backgroundColor: YELLOW,
                  borderColor: BLACK,
                }}
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
                  Simple GPS sharing. No complex apps. Start sharing in seconds.
                </p>
              </div>
            </div>
            {/* Dispatch Mode Card */}
            <div>
              <div
                className="border-4 p-6 md:p-8"
                style={{
                  backgroundColor: YELLOW,
                  borderColor: BLACK,
                }}
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
                  Real-time map. Organized calls. Complete visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — DRIVER MODE */}
      <section
        id="driver-mode"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-driver-mode"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center mb-12"
            data-testid="text-driver-mode-title"
          >
            HOW IT WORKS — DRIVER MODE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "ENTER DISPATCH CODE",
                desc: "Drivers enter their name and dispatch group code. Simple onboarding, no friction.",
              },
              {
                num: "02",
                title: "START SHARING",
                desc: "Tap 'Start Sharing'. GPS location updates every 5 seconds.",
              },
              {
                num: "03",
                title: "APPEAR LIVE",
                desc: "Driver appears live on dispatcher's map. Status shows LIVE if updated within 15 seconds.",
              },
              {
                num: "04",
                title: "COMPLETE TRIPS",
                desc: "Receive assigned trips. Complete trips. Generate detailed trip reports for easy invoicing and analysis.",
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
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center mb-12"
            data-testid="text-dispatch-mode-title"
          >
            HOW IT WORKS — DISPATCH MODE
          </h2>
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
                  desc: "All active drivers in real time",
                  dark: false,
                },
                {
                  num: "03",
                  title: "CREATE CALLS",
                  desc: "Customer name, phone, address autocomplete, fare price",
                  dark: false,
                },
                {
                  num: "04",
                  title: "ASSIGN DRIVERS",
                  desc: "Via dropdown selection",
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
                  title: "TRACK PERFORMANCE",
                  desc: "Active calls, completed, revenue, driver stats",
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
                alt="Dispatch Dashboard Wireframe"
                className="w-full"
                data-testid="img-dispatch-dashboard"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-features"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center mb-12"
            data-testid="text-features-title"
          >
            POWERFUL FEATURES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: MapPin,
                title: "LIVE GPS TRACKING",
                desc: "Drivers appear on map in real-time. 5-second updates.",
              },
              {
                num: "02",
                icon: Phone,
                title: "ORGANIZED CALLS",
                desc: "Yellow pins for active. Green for completed. No chaos.",
              },
              {
                num: "03",
                icon: UserCheck,
                title: "DRIVER STATUS",
                desc: "LIVE/OFFLINE based on 15-second threshold. Always know who's available.",
              },
              {
                num: "04",
                icon: Users,
                title: "CALL ASSIGNMENT",
                desc: "Dropdown assign drivers. Mark picked up. Track revenue.",
              },
              {
                num: "05",
                icon: Filter,
                title: "FILTERING",
                desc: "Today, 7/30 days, 6/12 months, custom range. Server-side fast.",
              },
              {
                num: "06",
                icon: RefreshCw,
                title: "AUTO-REFRESH",
                desc: "Dashboard updates every 3 seconds. No manual refresh needed.",
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

      {/* CALL WORKFLOW SECTION */}
      <section
        id="workflow"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", color: BLACK }}
        data-testid="section-workflow"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center mb-12"
            data-testid="text-workflow-title"
          >
            CALL WORKFLOW
          </h2>
          {/* Desktop: horizontal flow */}
          <div className="hidden md:flex items-start justify-center gap-2">
            {[
              {
                title: "ENTER CUSTOMER INFO",
                desc: "Name, phone, address",
              },
              { title: "PIN PREVIEW", desc: "Map preview of location" },
              { title: "DROP PIN", desc: "Confirm pickup point" },
              { title: "ASSIGN DRIVER", desc: "Select from dropdown" },
              { title: "PICKED UP", desc: "Mark call as picked up" },
              { title: "REVENUE LOGGED", desc: "Fare tracked automatically" },
            ].map((step, i) => (
              <div key={step.title} className="flex items-center gap-2">
                <div
                  className="border-3 p-4 min-w-[140px] text-center"
                  style={{
                    backgroundColor: YELLOW,
                    borderColor: BLACK,
                    borderWidth: "3px",
                  }}
                  data-testid={`card-workflow-step-${i + 1}`}
                >
                  <h4 className="text-xs font-black mb-1">{step.title}</h4>
                  <p className="text-[10px]">{step.desc}</p>
                </div>
                {i < 5 && (
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          {/* Mobile: vertical flow */}
          <div className="flex md:hidden flex-col items-center gap-2">
            {[
              {
                title: "ENTER CUSTOMER INFO",
                desc: "Name, phone, address",
              },
              { title: "PIN PREVIEW", desc: "Map preview of location" },
              { title: "DROP PIN", desc: "Confirm pickup point" },
              { title: "ASSIGN DRIVER", desc: "Select from dropdown" },
              { title: "PICKED UP", desc: "Mark call as picked up" },
              { title: "REVENUE LOGGED", desc: "Fare tracked automatically" },
            ].map((step, i) => (
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
                {i < 5 && <ArrowDown className="w-5 h-5" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP & FILTERING SECTION */}
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
                  <span>
                    <strong>Yellow pins</strong> = Active calls
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>
                    <strong>Green pins</strong> = Completed calls
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Filter className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Server-side filtering by:</strong> Today, Last 7
                    Days, Last 30 Days, Last 6 Months, Last 12 Months, All
                    Time, Custom Range
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Auto-refresh dashboard every 3 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Driver LIVE/OFFLINE based on unified 15-second threshold
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Real-time 'Last Seen' updates every second</span>
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

      {/* TECH STACK SECTION */}
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
                {
                  label: "Frontend",
                  value: "React + TypeScript + Tailwind CSS",
                },
                { label: "Backend", value: "Express.js (Node.js)" },
                {
                  label: "Database",
                  value: "PostgreSQL + Drizzle ORM",
                },
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
                  <RefreshCw
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
                  <span>Live polling (3-second intervals)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Navigation
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
                  <span>Ephemeral in-memory driver GPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
                  <span>Persistent call records in PostgreSQL</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DENOKO COOPERATIVE SECTION */}
      <section
        id="cooperative"
        className="py-16 md:py-24"
        style={{ backgroundColor: YELLOW, color: BLACK }}
        data-testid="section-cooperative"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8" data-testid="cooperative-logo">
            <TaxiLogo size="lg" />
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-8"
            data-testid="text-cooperative-title"
          >
            BUILT BY COOPERATIVES,
            <br />
            FOR COOPERATIVES
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto mb-10">
            Denoko Taxi is part of the Denoko Cooperative — technology that
            empowers workers, not replaces them. We believe taxi companies
            deserve enterprise-level tools without losing human connection.
          </p>
          <a
            href="#cooperative-mission"
            className="inline-block px-8 py-4 font-black text-sm tracking-wider border-2"
            style={{
              backgroundColor: BLACK,
              color: YELLOW,
              borderColor: YELLOW,
            }}
            data-testid="link-learn-cooperative"
          >
            LEARN ABOUT DENOKO COOPERATIVE →
          </a>
          <p className="text-sm mt-6 opacity-70">
            Read our mission at /about-us
          </p>
        </div>
      </section>

      {/* COOPERATIVE MISSION SECTION */}
      <section
        id="cooperative-mission"
        className="py-16 md:py-24"
        style={{ backgroundColor: YELLOW, color: BLACK }}
        data-testid="section-cooperative-mission"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-8"
            data-testid="text-cooperative-mission-title"
          >
            THE DENOKO COOPERATIVE
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-3xl">
            The Denoko Cooperative is a mission-driven organization building
            technology that serves workers, communities, and cooperative
            enterprises. We develop tools that put ownership and control in the
            hands of the people who use them every day.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-black mb-4">We believe:</h3>
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
                  <span>
                    Taxi companies deserve systems, not spreadsheets
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Communities deserve cooperative ownership</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-black mb-4 italic">Our ethos:</h3>
              <ul className="space-y-3 text-base italic">
                <li>Technology should serve people.</li>
                <li>Organization creates opportunity.</li>
                <li>Ownership builds generational strength.</li>
              </ul>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-black mt-12">
            Building the future of work, together.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        id="testimonials"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#fff", color: BLACK }}
        data-testid="section-testimonials"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center mb-12"
            data-testid="text-testimonials-title"
          >
            TRUSTED BY TAXI COOPERATIVES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                company: "NYC Taxi Cooperative",
                quote:
                  "Finally, a dispatch system that doesn't overcomplicate things. Our drivers love how simple it is.",
              },
              {
                company: "Chicago Metro Cabs",
                quote:
                  "Real-time visibility changed everything. We know exactly where every driver is.",
              },
              {
                company: "Bay Area Taxi Alliance",
                quote:
                  "No more radio chaos. Organized calls, clear assignments, better revenue.",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.company}
                className="p-6 md:p-8"
                style={{
                  border: `4px double ${BLACK}`,
                }}
                data-testid={`card-testimonial-${testimonial.company.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <p className="text-sm mb-6 italic">"{testimonial.quote}"</p>
                <p className="text-sm font-black">{testimonial.company}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm">
            Join taxi companies using cooperative technology
          </p>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="pricing"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#f5f5f5", color: BLACK }}
        data-testid="section-pricing"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-center mb-12"
            data-testid="text-pricing-title"
          >
            SIMPLE PRICING
          </h2>
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
                  <CheckSquare
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
                  Unlimited drivers
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
                  Custom dispatch codes
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: YELLOW }}
                  />
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
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
}
