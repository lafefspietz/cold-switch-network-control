const cold_rf_network = {
    "output_switch_1": {
        "label": "Cryogenic Output Switch 1",
        "state": "internal_open",
        "states": ["internal_open", "internal_short", "internal_load", "port1_output", "port2_jpa", "port3_hot_wire", "port4_sntj", "port5_short", "port6_open"]
    },
    "thru_switch_pair": {
        "label": "2 Port Device Cryogenic Switch Pair",
        "state": "internal_open",
        "states": ["internal_open", "internal_short", "internal_load", "port1_thru", "port2_reflect", "port3_line", "port4_qubit", "port5_twpa", "port6_coupler"]
    },
    "output_switch_2": {
        "label": "Cryogenic Output Switch 2",
        "state": "internal_open",
        "states": ["internal_open", "internal_short", "internal_load", "port1_output", "port2_jpa", "port3_hot_wire", "port4_sntj", "port5_short", "port6_open"]
    }
};

let pending_hardware_updates = {};

document.addEventListener("DOMContentLoaded", () => {


    const coldTarget = document.getElementById("cold-network-target");
    const coldFieldset = document.createElement("fieldset");
    coldFieldset.className = "compact-panel lower-matrix";
    
    const coldLegend = document.createElement("legend");
    coldLegend.textContent = "Cold Network";
    coldFieldset.appendChild(coldLegend);

    Object.keys(cold_rf_network).forEach(coldKey => {
        const itemConfig = cold_rf_network[coldKey];
        const formLabel = document.createElement("label");
        const span = document.createElement("span");
        span.textContent = itemConfig.label + ":";
        formLabel.appendChild(span);

        const select = document.createElement("select");
        select.name = coldKey;
        itemConfig.states.forEach(state => {
            const opt = document.createElement("option");
            opt.value = state;
            opt.textContent = state;
            if (state === itemConfig.state) opt.selected = true;
            select.appendChild(opt);
        });
        select.addEventListener("change", (e) => {
            cold_rf_network[coldKey].state = e.target.value;
            pending_hardware_updates[coldKey] = e.target.value;
            console.log("Pending Queue Update:", JSON.stringify(pending_hardware_updates));
        });
        formLabel.appendChild(select);
        coldFieldset.appendChild(formLabel);
    });
    coldTarget.appendChild(coldFieldset);
});