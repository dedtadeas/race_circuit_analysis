<template>
  <div>
    <ul class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">>></router-link></li>
      <li class="breadcrumb-item active">Circuits</li>
    </ul>

    <h1 class="page-header">Circuits</h1>

    <p>List of circuits. Each circuit name links to its dedicated page:</p>

    <ul>
      <li v-for="circuit in circuits" :key="circuit.id">
        <router-link :to="`/circuits/${circuit.id}`">{{ circuit.name }}</router-link>
      </li>
    </ul>

    <!-- Overview map can be added here later -->
  </div>
</template>

<script>
export default {
  name: "CircuitList",
  data() {
    return {
      circuits: [
        { id: 1, name: "RedBull Ring" },
        { id: 2, name: "Silverstone Circuit" },
        { id: 3, name: "Suzuka Circuit" },
        { id: 4, name: "Spa-Francorchamps" }
      ]
    };
  }
};
</script>
