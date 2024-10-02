<template>
  <div>
    <ul class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">>></router-link></li>
      <li class="breadcrumb-item active">Circuits</li>
    </ul>

    <h1 class="page-header">Circuits by Country</h1>

    <p>List of circuits categorized by country. Each circuit name links to its dedicated page:</p>

    <!-- Loop through countries -->
    <ul v-for="(circuits, country) in circuitsByCountry" :key="country">
      <li>
        <strong>{{ country }}</strong>
        <ul>
          <!-- Loop through circuits within each country -->
          <li v-for="circuit in circuits" :key="circuit.id">
            <router-link :to="`/circuits/${circuit.id}`">{{ circuit.name }}</router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CircuitList",
  data() {
    return {
      circuitsByCountry: {
        Austria: [
          { id: 1, name: "RedBull Ring" }
        ],
        Belgium: [
          { id: 2, name: "Circuit de Spa-Francorchamps" }
        ],
        // Finland: [
        //   { id: 3, name: "KymiRing" }
        // ],
        // France: [
        //   { id: 4, name: "Le Mans Circuit" }
        // ],
        Germany: [
          { id: 5, name: "Sachsenring Circuit" },
          { id: 6, name: "Nürburgring" },
          { id: 7, name: "Hockenheim" }
        ],
        // Czech_Republic: [
        //   { id: 8, name: "Autodromo Brno" }
        // ],
        // Hungary: [
        //   { id: 9, name: "Hungaroring" }
        // ],
        // Italy: [
        //   { id: 10, name: "Imola Circuit" },
        //   { id: 11, name: "Monza Circuit" },
        //   { id: 12, name: "Mugello Circuit" },
        //   { id: 13, name: "Misano World Circuit Marco Simoncelli" }
        // ],
        // Monaco: [
        //   { id: 14, name: "Monaco Circuit" }
        // ],
        // Netherlands: [
        //   { id: 15, name: "Zandvoort Circuit" },
        //   { id: 16, name: "TT Circuit Assen" }
        // ],
        // Portugal: [
        //   { id: 17, name: "Portimão Circuit" }
        // ],
        // Spain: [
        //   { id: 18, name: "Circuit de Barcelona-Catalunya" },
        //   { id: 19, name: "Jerez Circuit" },
        //   { id: 20, name: "MotorLand Aragón" },
        //   { id: 21, name: "Valencia Circuit" }
        // ],
        // Turkey: [
        //   { id: 22, name: "Istanbul Park Circuit" }
        // ],
        // UK: [
        //   { id: 23, name: "Silverstone Circuit" }
        // ],
        Bahrain: [
          { id: 24, name: "Bahrain International Circuit" }
        ],
        Qatar: [
          { id: 25, name: "Losail International Circuit" }
        ],
        Saudi_Arabia: [
          { id: 26, name: "Jeddah Street Circuit" }
        ],
        UAE: [
          { id: 27, name: "Yas Marina Circuit" }
        ]
      }
    };
  }
};
</script>
