export type ApartmentStatus = "new" | "saved" | "tour" | "contacted" | "applied" | "passed";

export type Apartment = {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  latitude: number;
  longitude: number;
  rent: number;
  rentHigh?: number;
  floorplan: string;
  squareFeet: number;
  commute: string;
  commuteMinutes: number;
  transit: string;
  style: string;
  description: string;
  nearby: string[];
  strongestFit: string;
  watch: string;
  sourceUrl: string;
  sourceName: string;
  checked: string;
  cats: true;
  laundry: "In-unit";
  scores: {overall: number; canopy: number; warmth: number; access: number; street: number};
};

// August 9 replacement field. Every card represents a currently advertised floor plan,
// not merely a building-level possibility, and explicitly clears Luke's 630 sq ft gate.
export const apartments: Apartment[] = [
  {
    id: "hawk-733", name: "Hawk Apartments", neighborhood: "Greenwood / North Seattle", address: "703 N 105th St, Seattle, WA 98133",
    latitude: 47.7049, longitude: -122.3480, rent: 1675, floorplan: "1BR / 1BA", squareFeet: 733,
    commute: "19–28 min to central Seattle", commuteMinutes: 23, transit: "Route 40 at the building",
    style: "Wood-burning fireplace · carpet · private deck", description: "This is the clearest direct hit in the field: a real living room, fireplace, storage, private outdoor space and enough square footage for the cat, music gear and furniture to coexist.",
    nearby: ["Sandel Park", "Carkeek Park routes", "Greenwood shops"], strongestFit: "Best home-like interior and character-to-price ratio", watch: "Walk the 105th/Aurora edge after dark and prioritize the residential-facing unit.",
    sourceUrl: "https://www.zillow.com/homedetails/703-N-105th-St-APT-8-Seattle-WA-98133/2090365513_zpid/", sourceName: "Zillow live unit", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 98, canopy: 90, warmth: 100, access: 82, street: 83},
  },
  {
    id: "edmonds-gateway", name: "Edmonds Gateway", neighborhood: "Edmonds / Lake Ballinger", address: "8610 240th St SW, Edmonds, WA 98026",
    latitude: 47.7782, longitude: -122.3510, rent: 1899, rentHigh: 2175, floorplan: "1BR / 1BA", squareFeet: 770,
    commute: "26–36 min to central Seattle", commuteMinutes: 31, transit: "Bus connection to Mountlake Terrace Link",
    style: "Fireplace · private outdoor space · full-size rooms", description: "The 770-square-foot plan is proportioned like an actual home, and the larger 768-square-foot den plan remains under $2,300. Mature grounds and a wood-burning fireplace move it far beyond box-with-amenities territory.",
    nearby: ["Lake Ballinger", "Edmonds waterfront routes", "Interurban Trail"], strongestFit: "Best blend of space, warmth and still-reasonable rent", watch: "The transit chain is longer; this wins if remote work remains the dominant week.",
    sourceUrl: "https://www.edmondsgatewayapts.com/floorplans", sourceName: "Official floor plans", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 97, canopy: 94, warmth: 97, access: 72, street: 92},
  },
  {
    id: "ivorywood", name: "Ivorywood", neighborhood: "Bothell / Lake Forest Park edge", address: "8700 NE Bothell Way, Bothell, WA 98011",
    latitude: 47.7537, longitude: -122.2254, rent: 1835, rentHigh: 1959, floorplan: "1BR / 1BA", squareFeet: 790,
    commute: "25–35 min to central Seattle", commuteMinutes: 30, transit: "522 corridor to Link and downtown",
    style: "Large carpeted rooms · balcony · restrained updates", description: "Nearly 800 square feet at the middle of the budget. This is the anti-micro-unit: long living-room walls, a real dining zone and enough space to make the interior personal rather than merely efficient.",
    nearby: ["Burke-Gilman Trail", "Lake Washington", "Bothell Main Street"], strongestFit: "Best pure space value among one-bedrooms", watch: "Bothell Way is the tradeoff; inspect the exact building position and road noise.",
    sourceUrl: "https://www.zillow.com/apartments/bothell-wa/ivorywood/5XjR3m/", sourceName: "Zillow live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 96, canopy: 91, warmth: 92, access: 76, street: 86},
  },
  {
    id: "brackett", name: "Brackett Apartments", neighborhood: "Edmonds / Esperance", address: "9501 244th St SW, Edmonds, WA 98020",
    latitude: 47.7770, longitude: -122.3618, rent: 1961, rentHigh: 1986, floorplan: "1BR / 1BA", squareFeet: 665,
    commute: "27–38 min to central Seattle", commuteMinutes: 32, transit: "Bus connection to Mountlake Terrace Link",
    style: "Wood-burning fireplace · balcony · renovated Northwest", description: "It keeps the parts of an older Pacific Northwest apartment worth keeping—fireplace, outdoor space, mature trees—while current units have renovated kitchens and flooring.",
    nearby: ["Edmonds waterfront", "Lake Ballinger", "Scenic walking trails"], strongestFit: "Best character-without-decay candidate", watch: "Confirm the exact unit carries the fireplace; it is listed as a select-home feature.",
    sourceUrl: "https://www.zillow.com/apartments/edmonds-wa/brackett-apartments/5XjTws/", sourceName: "Zillow live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 96, canopy: 95, warmth: 98, access: 70, street: 93},
  },
  {
    id: "serra-vista", name: "Serra Vista", neighborhood: "Lynnwood / Alderwood", address: "15517 40th Ave W, Lynnwood, WA 98087",
    latitude: 47.8589, longitude: -122.2865, rent: 1725, rentHigh: 1775, floorplan: "1BR / 1BA", squareFeet: 750,
    commute: "30–42 min to central Seattle", commuteMinutes: 35, transit: "Lynnwood Link via local bus",
    style: "Fireplace · carpet option · patio or balcony", description: "The official 750-square-foot plan is large, inexpensive and built around ordinary comfort rather than lobby spectacle. A qualifying 839-square-foot two-bedroom is also advertised at $2,296.",
    nearby: ["Scriber Lake Park", "Interurban Trail", "Alderwood"], strongestFit: "Best financial breathing room without losing actual space", watch: "Farther from Seattle; only keep it high if remote work is stable and the building feels maintained in person.",
    sourceUrl: "https://www.serravistaapts.com/floorplans", sourceName: "Official live floor plans", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 94, canopy: 91, warmth: 94, access: 66, street: 90},
  },
  {
    id: "taluswood", name: "Taluswood", neighborhood: "Mountlake Terrace", address: "4208 236th St SW, Mountlake Terrace, WA 98043",
    latitude: 47.7843, longitude: -122.2907, rent: 1815, rentHigh: 1845, floorplan: "1BR / 1BA", squareFeet: 644,
    commute: "24–32 min to central Seattle", commuteMinutes: 28, transit: "Mountlake Terrace Link nearby",
    style: "Creek views · carpet · wood-burning fireplace", description: "The 644-square-foot plan barely clears the gate, but it earns its place through the exact texture you wanted: wooded landscaping, creek views, carpeting, fireplace and a balcony with storage.",
    nearby: ["Mountlake Terrace Link", "Ballinger Park", "Creekside trail"], strongestFit: "Best compact plan with genuine Northwest atmosphere", watch: "Ask whether the available unit has both carpet and fireplace; those vary by home.",
    sourceUrl: "https://seattle.craigslist.org/sno/apa/d/mountlake-terrace-enjoy-all-the-modern/7926643111.html", sourceName: "Live property listing", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 94, canopy: 98, warmth: 99, access: 82, street: 91},
  },
  {
    id: "edmonds-highlands", name: "Edmonds Highlands", neighborhood: "Edmonds / Lake Ballinger", address: "23326 Edmonds Way, Edmonds, WA 98026",
    latitude: 47.7885, longitude: -122.3328, rent: 1750, floorplan: "1BR / 1BA", squareFeet: 718,
    commute: "26–36 min to central Seattle", commuteMinutes: 31, transit: "Bus connection to Mountlake Terrace Link",
    style: "Forested hillside · carpet · spacious older proportions", description: "A wooded-slope apartment that still has current interiors and real rooms. The unusually strong alternate is the advertised 1,087-square-foot two-bedroom at only $2,018.",
    nearby: ["Lake Ballinger", "Edmonds waterfront routes", "Interurban Trail"], strongestFit: "Best optional two-bedroom upgrade in the entire field", watch: "Edmonds Way frontage matters; inspect the walking route and request a forest-facing unit.",
    sourceUrl: "https://www.zillow.com/apartments/edmonds-wa/edmonds-highlands/5XjTtZ/", sourceName: "Zillow live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 94, canopy: 99, warmth: 95, access: 70, street: 88},
  },
  {
    id: "edmonds-highlands-b306", name: "Edmonds Highlands · B306", neighborhood: "Edmonds / Lake Ballinger", address: "23326 Edmonds Way, Edmonds, WA 98026",
    latitude: 47.7885, longitude: -122.3328, rent: 2018, floorplan: "2BR / 2BA", squareFeet: 1087,
    commute: "26–36 min to central Seattle", commuteMinutes: 31, transit: "Bus connection to Mountlake Terrace Link",
    style: "Forested view · carpet · full second project room", description: "This is not padding the list with another building name. It is a materially different live option: 1,087 square feet and two bathrooms for $2,018, creating a closed-door music, office or production room while remaining far below the ceiling.",
    nearby: ["Lake Ballinger", "Edmonds waterfront routes", "Interurban Trail"], strongestFit: "Best total-space proposition in the search", watch: "The second room is valuable only if the outer location works; run the real weekly commute rather than comparing rent alone.",
    sourceUrl: "https://www.zillow.com/apartments/edmonds-wa/edmonds-highlands/5XjTtZ/", sourceName: "Zillow live unit B306", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 95, canopy: 99, warmth: 96, access: 70, street: 88},
  },
  {
    id: "rivercroft", name: "Rivercroft", neighborhood: "Bothell / Sammamish River", address: "12109 Woodinville Dr, Bothell, WA 98011",
    latitude: 47.7594, longitude: -122.1842, rent: 1750, rentHigh: 1860, floorplan: "1BR / 1BA", squareFeet: 722,
    commute: "26–38 min to central Seattle", commuteMinutes: 31, transit: "522 corridor and regional bus connections",
    style: "Fireplace · balcony · conventional full-size rooms", description: "A 722-square-foot one-bedroom at $1,750, with fireplace and balcony. If a separate work or music room becomes valuable, the current 889-square-foot two-bedroom is $2,195.",
    nearby: ["Sammamish River Trail", "UW Bothell", "Bothell Main Street"], strongestFit: "Best flexible one-to-two-bedroom progression", watch: "Tour the immediate Woodinville Drive edge; the interior value is stronger than the frontage.",
    sourceUrl: "https://www.zillow.com/apartments/bothell-wa/rivercroft-apartments/5XjLKQ/", sourceName: "Zillow live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 93, canopy: 91, warmth: 94, access: 72, street: 82},
  },
  {
    id: "northern-lights", name: "Northern Lights", neighborhood: "Mountlake Terrace", address: "4402 212th St SW, Mountlake Terrace, WA 98043",
    latitude: 47.8062, longitude: -122.2938, rent: 1825, rentHigh: 1950, floorplan: "1BR / 1BA", squareFeet: 680,
    commute: "23–31 min to central Seattle", commuteMinutes: 27, transit: "Mountlake Terrace Link and ORCA move-in pass",
    style: "Carpet · mountain views · quiet community", description: "The published one-bedroom range is 680–720 square feet, and the complex explicitly emphasizes quiet, comfort and large floor plans rather than compressed new construction.",
    nearby: ["Mountlake Terrace Link", "Ballinger Park", "Interurban Trail"], strongestFit: "Best quiet-home relationship with Link", watch: "Inventory is marked coming soon; use the card as a contact-now rather than apply-now lead.",
    sourceUrl: "https://nlapt.com/", sourceName: "Official floor plans", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 92, canopy: 93, warmth: 93, access: 88, street: 92},
  },
  {
    id: "echo-lake", name: "Echo Lake Apartments", neighborhood: "Shoreline / Echo Lake", address: "1150 N 192nd St, Shoreline, WA 98133",
    latitude: 47.7686, longitude: -122.3456, rent: 1905, floorplan: "1BR / 1BA", squareFeet: 656,
    commute: "21–30 min to central Seattle", commuteMinutes: 25, transit: "Shoreline North / 185th Link nearby",
    style: "Lakeside light · balcony · practical contemporary", description: "A full one-bedroom beside Echo Lake with in-unit laundry and a private outdoor-space signal. It is modern enough to be clean without presenting as a sterile tower.",
    nearby: ["Echo Lake Park", "Shoreline North Link", "Interurban Trail"], strongestFit: "Best lake-and-Link compromise", watch: "Confirm the unit does not face the loudest part of Aurora access traffic.",
    sourceUrl: "https://www.zillow.com/apartments/shoreline-wa/echo-lake-apartments/5gKmNw/", sourceName: "Zillow live unit", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 92, canopy: 95, warmth: 89, access: 90, street: 86},
  },
  {
    id: "ballinger-commons", name: "Ballinger Commons", neighborhood: "Shoreline / Lake Ballinger", address: "2405 N 202nd Pl, Shoreline, WA 98133",
    latitude: 47.7771, longitude: -122.3045, rent: 1810, rentHigh: 2070, floorplan: "1BR / 1BA", squareFeet: 669,
    commute: "23–32 min to central Seattle", commuteMinutes: 27, transit: "Between Shoreline North and Mountlake Terrace Link",
    style: "77 wooded acres · carpet · lake views", description: "This is the most landscape-heavy candidate: rolling grounds, ponds, walking trails, large windows and washer/dryer in every home. The 884-square-foot two-bedroom is advertised at $2,070.",
    nearby: ["Lake Ballinger", "Interurban Trail", "Mountlake Terrace Link"], strongestFit: "Best outdoor field and lowest-density feeling", watch: "The community is enormous; tour the exact building and parking-to-door path, not only the model unit.",
    sourceUrl: "https://www.zillow.com/apartments/shoreline-wa/ballinger-commons/5hJ4PV/", sourceName: "Zillow + official live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 92, canopy: 100, warmth: 94, access: 82, street: 94},
  },
  {
    id: "junction-160", name: "Junction 160", neighborhood: "Shoreline / Highland Terrace", address: "16100 Linden Ave N, Shoreline, WA 98133",
    latitude: 47.7461, longitude: -122.3483, rent: 1595, floorplan: "1BR / 1BA", squareFeet: 683,
    commute: "20–29 min to central Seattle", commuteMinutes: 24, transit: "Shoreline South / 148th Link connection",
    style: "Small building · wood laminate · private patio", description: "A 683-square-foot one-bedroom in a secured smaller-scale building. The finishes are current, but the private patio and ordinary proportions keep it out of hotel-box territory.",
    nearby: ["Shoreline Park", "Shoreline South Link", "Richmond Beach routes"], strongestFit: "Best inexpensive small-building candidate", watch: "Aurora is close; inspect the exact walking field rather than trusting the Shoreline label.",
    sourceUrl: "https://www.zillow.com/apartments/shoreline-wa/junction-160/5gjhSG/", sourceName: "Zillow live unit", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 91, canopy: 87, warmth: 91, access: 87, street: 84},
  },
  {
    id: "northpointe", name: "Northpointe Highlands", neighborhood: "Kenmore", address: "17512 83rd Pl NE, Kenmore, WA 98028",
    latitude: 47.7550, longitude: -122.2290, rent: 1690, floorplan: "1BR / 1BA", squareFeet: 700,
    commute: "25–36 min to central Seattle", commuteMinutes: 30, transit: "522 bus corridor",
    style: "Carpet · balcony · quiet residential pocket", description: "Seven hundred square feet, full-size laundry, a balcony and a rent below the target floor. The advertised 912-square-foot two-bedroom is only $1,970 if a studio room becomes important.",
    nearby: ["Burke-Gilman Trail", "Log Boom Park", "Kenmore Town Square"], strongestFit: "Best low-cost option with an unusually strong 2BR upgrade", watch: "Management reviews are mixed; inspect maintenance quality carefully rather than letting the price decide.",
    sourceUrl: "https://www.apartments.com/northpointe-highlands-kenmore-wa/wqx0e7k/", sourceName: "Apartments.com live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 90, canopy: 93, warmth: 91, access: 75, street: 91},
  },
  {
    id: "villas-beardslee", name: "The Villas at Beardslee", neighborhood: "Bothell / Beardslee", address: "19128 112th Ave NE, Bothell, WA 98011",
    latitude: 47.7670, longitude: -122.1903, rent: 1943, rentHigh: 2233, floorplan: "1BR / 1BA", squareFeet: 773,
    commute: "27–38 min to central Seattle", commuteMinutes: 32, transit: "Regional bus near UW Bothell",
    style: "Warm community scale · large rooms · balcony", description: "Current one-bedroom inventory runs from 773 to 814 square feet. It is polished, but it avoids the compressed-floor-plan tax and sits beside trails and the smaller Bothell town center.",
    nearby: ["North Creek Trail", "UW Bothell", "Bothell Main Street"], strongestFit: "Best large polished one-bedroom under the ceiling", watch: "Do not accept the 592-square-foot studio-conversion plan; the 773+ square-foot A1/A3 plans are the only targets.",
    sourceUrl: "https://www.zillow.com/apartments/bothell-wa/the-villas-at-beardslee/CjHvs6/", sourceName: "Zillow live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 90, canopy: 89, warmth: 90, access: 71, street: 91},
  },
  {
    id: "district", name: "The District", neighborhood: "Bothell / North Creek", address: "17716 Bothell Everett Hwy, Bothell, WA 98012",
    latitude: 47.8371, longitude: -122.2082, rent: 1721, rentHigh: 1999, floorplan: "1BR / 1BA", squareFeet: 652,
    commute: "31–43 min to central Seattle", commuteMinutes: 36, transit: "Swift / regional bus connections",
    style: "Carpet · large community · conventional rooms", description: "The one-bedroom barely clears the space gate, but the live 1,057-square-foot two-bedroom at $1,999 is the real reason this card exists. It creates a separate project room for less than many Seattle micro-units.",
    nearby: ["North Creek Park", "Mill Creek Town Center", "Regional trails"], strongestFit: "Best project-room economics", watch: "Income restrictions apply; verify whether $99K qualifies before spending time on a tour.",
    sourceUrl: "https://www.districtwa.com/floorplans", sourceName: "Official live floor plans", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 89, canopy: 86, warmth: 84, access: 59, street: 88},
  },
  {
    id: "pop", name: "The Pop", neighborhood: "Bothell / Downtown", address: "9634 Thorsk St, Bothell, WA 98011",
    latitude: 47.7604, longitude: -122.2082, rent: 2118, rentHigh: 2223, floorplan: "1BR / 1BA", squareFeet: 707,
    commute: "26–37 min to central Seattle", commuteMinutes: 31, transit: "522 corridor and Bothell transit center",
    style: "Balcony · full-size laundry · bright but not tiny", description: "The 707-square-foot plan is the useful modern candidate: current finishes and windows, but enough floor area to keep the apartment from feeling like a branded sleep pod.",
    nearby: ["Bothell Main Street", "Sammamish River Trail", "McMenamins Anderson School"], strongestFit: "Best modern Bothell layout with actual breathing room", watch: "This is cleaner and newer than the stated aesthetic ideal; the exact unit needs strong light or a balcony to earn the premium.",
    sourceUrl: "https://www.zillow.com/apartments/bothell-wa/the-pop/BWX4YF/", sourceName: "Zillow property inventory", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 88, canopy: 86, warmth: 82, access: 75, street: 92},
  },
  {
    id: "capri", name: "Capri Apartments", neighborhood: "Mountlake Terrace", address: "21416 52nd Ave W, Mountlake Terrace, WA 98043",
    latitude: 47.8050, longitude: -122.3036, rent: 1587, rentHigh: 1795, floorplan: "1BR / 1BA", squareFeet: 650,
    commute: "24–33 min to central Seattle", commuteMinutes: 28, transit: "Mountlake Terrace Link via local connection",
    style: "Renovated · carpet options · patio or balcony", description: "A simple 650-square-foot plan with full-size laundry and outdoor space. It is not the most distinctive, but it is cheap enough to furnish into a home rather than paying for staged aesthetics.",
    nearby: ["Ballinger Park", "Interurban Trail", "Mountlake Terrace Link"], strongestFit: "Best low-rent clean slate that still clears every gate", watch: "Favor the renovated $1,795 homes; the cheapest promotional unit may carry a short lease or different finish package.",
    sourceUrl: "https://www.zillow.com/apartments/mountlake-terrace-wa/capri-apartments/5XjSCx/", sourceName: "Zillow live units", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 88, canopy: 88, warmth: 85, access: 78, street: 91},
  },
  {
    id: "traxx-640", name: "Traxx Apartments", neighborhood: "Mountlake Terrace / Link", address: "23905 Van Ry Blvd, Mountlake Terrace, WA 98043",
    latitude: 47.7842, longitude: -122.3058, rent: 1690, floorplan: "1BR / 1BA", squareFeet: 640,
    commute: "20–27 min by Link", commuteMinutes: 23, transit: "Mountlake Terrace Link · short walk",
    style: "Balcony · wood-style floor · transit-oriented", description: "This is here for one exact 640-square-foot unit—not the more common 575-square-foot plan. It provides the cleanest fast-Link route while still clearing the hard space floor.",
    nearby: ["Mountlake Terrace Link", "Interurban Trail", "Ballinger Park"], strongestFit: "Best direct rail value among qualifying units", watch: "Unit 410 is the qualifying layout; reject the 575- and 616-square-foot versions regardless of concession.",
    sourceUrl: "https://www.zillow.com/apartments/mountlake-terrace-wa/traxx-apartments/ChhbpW/", sourceName: "Zillow live unit", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 87, canopy: 79, warmth: 75, access: 98, street: 89},
  },
  {
    id: "terrace-west-f", name: "Terrace Station West", neighborhood: "Mountlake Terrace / Link", address: "24000 Van Ry Blvd, Mountlake Terrace, WA 98043",
    latitude: 47.7837, longitude: -122.3067, rent: 2287, floorplan: "1BR / 1BA", squareFeet: 760,
    commute: "20–27 min by Link", commuteMinutes: 23, transit: "Mountlake Terrace Link · beside the station",
    style: "Large windows · balcony · modern with real room depth", description: "Most Terrace Station one-bedrooms fail the space gate. West Apt F does not: 760 square feet directly beside Link, preserving access without sacrificing the apartment itself.",
    nearby: ["Mountlake Terrace Link", "Interurban Trail", "Ballinger Park"], strongestFit: "Best large apartment with genuinely fast rail", watch: "Near the ceiling and more modern than warm; inspect acoustics and whether the room proportions feel personal.",
    sourceUrl: "https://www.terracestationapts.com/mountlake-terrace/terrace-station-west/1-bedroom-apartments/", sourceName: "Official live floor plan", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 87, canopy: 80, warmth: 80, access: 100, street: 91},
  },
  {
    id: "kinect-agate", name: "Kinect @ Shoreline", neighborhood: "Shoreline / North City", address: "18553 8th Ave NE, Shoreline, WA 98155",
    latitude: 47.7636, longitude: -122.3206, rent: 2117, rentHigh: 2147, floorplan: "1BR / 1BA", squareFeet: 650,
    commute: "20–28 min by Link", commuteMinutes: 23, transit: "Shoreline North / 185th Link nearby",
    style: "Polished modern · balcony · larger Pearl option", description: "Agate is the 650-square-foot admission floor; Pearl is the better 715-square-foot option for only $30 more. It is visually cleaner than warmer, but the size and rail geometry are real.",
    nearby: ["Shoreline North Link", "North City shops", "Hamlin Park"], strongestFit: "Best current large-one-bedroom choice near Shoreline Link", watch: "Do not let the amenities disguise the sterile-box risk; choose Pearl only if the light and layout feel alive.",
    sourceUrl: "https://www.zillow.com/apartments/shoreline-wa/kinect-%40-shoreline/ChwD4P/", sourceName: "Zillow live floor plans", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 86, canopy: 82, warmth: 72, access: 96, street: 91},
  },
  {
    id: "thornton-a19", name: "Thornton Place · A19", neighborhood: "Northgate / Thornton Creek", address: "337 NE 103rd St, Seattle, WA 98125",
    latitude: 47.7031, longitude: -122.3230, rent: 2298, floorplan: "1BR / 1BA", squareFeet: 776,
    commute: "13–19 min by Link", commuteMinutes: 16, transit: "Northgate Link · short walk",
    style: "Deep one-bedroom · balcony signal · urban convenience", description: "The only close-in modern building that earns its price through 776 actual square feet. It is near the upper limit, but it materially improves both size and access rather than selling a tiny plan with a roof deck.",
    nearby: ["Northgate Link", "Thornton Creek", "Maple Leaf Reservoir Park"], strongestFit: "Best close-in size plus rapid transit", watch: "This is more mixed-use and managed than homey; evaluate nighttime activity and interior warmth in person.",
    sourceUrl: "https://thornton-place.com/floorplans/a19/", sourceName: "Official live floor plan", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 86, canopy: 83, warmth: 78, access: 100, street: 88},
  },
  {
    id: "bower-o9", name: "The Bower · O9", neighborhood: "Kirkland / Totem Lake", address: "11811 NE 128th St, Kirkland, WA 98034",
    latitude: 47.7147, longitude: -122.1821, rent: 2254, floorplan: "1BR / 1BA", squareFeet: 651,
    commute: "25–38 min to central Seattle", commuteMinutes: 31, transit: "Totem Lake regional bus connections",
    style: "Wood-style floor · balcony · controlled modern", description: "O9 is the exact qualifying floor plan; the cheaper O2 is too small. It enters as a clean Eastside option with enough room, good daily services and lower street friction than central Seattle.",
    nearby: ["Juanita Bay routes", "Totem Lake Park", "Cross Kirkland Corridor"], strongestFit: "Best low-friction Eastside operating base", watch: "Only O9 clears the gate under budget; do not substitute an O2 or A5 during leasing calls.",
    sourceUrl: "https://www.thebowerkirkland.com/floorplans", sourceName: "Official live floor plan", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 85, canopy: 87, warmth: 79, access: 70, street: 95},
  },
  {
    id: "flyway-207", name: "Flyway Kenmore · 207", neighborhood: "Kenmore / Lake Washington", address: "18115 68th Ave NE, Kenmore, WA 98028",
    latitude: 47.7600, longitude: -122.2503, rent: 2399, floorplan: "1BR / 2BA", squareFeet: 962,
    commute: "24–35 min to central Seattle", commuteMinutes: 29, transit: "522 corridor to Seattle",
    style: "Boutique 28-home building · huge plan · lake access", description: "This is the outlier: 962 square feet, two bathrooms, large windows and immediate Burke-Gilman access at exactly one dollar below the ceiling. It offers near-two-bedroom spatial freedom without another bedroom.",
    nearby: ["Burke-Gilman Trail", "Log Boom Park", "Lake Washington"], strongestFit: "Largest qualifying one-bedroom by a landslide", watch: "Contact is unavailable through Zillow and the rent leaves no ceiling room; verify directly before treating it as actionable.",
    sourceUrl: "https://www.zillow.com/apartments/kenmore-wa/flyway-kenmore/CkBNhg/", sourceName: "Zillow live unit", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 84, canopy: 94, warmth: 85, access: 76, street: 94},
  },
  {
    id: "hazel-317", name: "Hazel Apartments · 317", neighborhood: "Edmonds / Highway 99", address: "23400 Highway 99, Edmonds, WA 98026",
    latitude: 47.7867, longitude: -122.3456, rent: 1575, floorplan: "1BR / 1BA", squareFeet: 630,
    commute: "25–35 min to central Seattle", commuteMinutes: 30, transit: "Bus to Mountlake Terrace Link",
    style: "Current finishes · exact minimum size · strong concession", description: "The exact 630-square-foot floor plan makes the list as a cheap control candidate. It proves the hard floor can be met at $1,575, but it does not outrank warmer buildings merely because it is inexpensive.",
    nearby: ["Lake Ballinger", "Mountlake Terrace Link routes", "Edmonds waterfront routes"], strongestFit: "Cheapest exact hard-gate survivor", watch: "Highway 99 frontage is the largest street-context penalty in the list; inspect after dark before any application.",
    sourceUrl: "https://www.zillow.com/apartments/edmonds-wa/hazel-apartments/CkCg23/", sourceName: "Zillow live unit", checked: "Aug 9, 2026", cats: true, laundry: "In-unit",
    scores: {overall: 80, canopy: 76, warmth: 75, access: 72, street: 65},
  },
];

export const apartmentSourceNotes = {
  researchedAt: "August 9, 2026",
  income: 99000,
  salary: 80000,
  passiveIncome: 19000,
  rentFloor: 1700,
  rentCeiling: 2400,
  squareFeetFloor: 630,
};
