/**
 * SCCS REGISTRE - SYSTEME DE SAUVEGARDE CENTRALISÉ
 * Ce fichier gère la mémoire (LocalStorage) partagée entre le Codex et les Fiches.
 */

const SCCS_Registre = {
    // Clé unique de stockage dans le navigateur
    STORAGE_KEY: "sccs_registre_v1",

    // Cache des données en mémoire vive
    data: {
        profiles: [] // Liste des objets { id, name, timestamp, content }
    },

    /**
     * Initialisation : Charge les données depuis le navigateur
     */
    init: function() {
        const store = localStorage.getItem(this.STORAGE_KEY);
        if (store) {
            try {
                this.data = JSON.parse(store);
            } catch (e) {
                console.error("[SCCS Registre] Erreur de lecture des données corrompues :", e);
                // On garde le tableau vide par sécurité
            }
        } else {
            // Premier lancement : aucune donnée existante
            console.log("[SCCS Registre] Initialisation d'un nouveau registre vierge.");
        }
    },

    /**
     * Récupère la liste complète des profils (pour le Sommaire du Livre)
     * @returns {Array} Tableau des profils
     */
    getAllProfiles: function() {
        // On renvoie une copie pour éviter les mutations accidentelles
        return [...this.data.profiles];
    },

    /**
     * Récupère un profil spécifique par son ID (pour la Fiche)
     * @param {string} id - L'identifiant unique (ex: "p_1702394...")
     * @returns {Object|null} Le profil ou null si introuvable
     */
    getProfile: function(id) {
        return this.data.profiles.find(p => p.id === id) || null;
    },

    /**
     * Crée une nouvelle page vierge dans le registre
     * @returns {string} L'ID du nouveau profil créé
     */
    createProfile: function() {
        const newId = "p_" + Date.now(); // ID unique basé sur l'heure
        const newProfile = {
            id: newId,
            name: "Nouveau Personnage",
            timestamp: Date.now(),
            content: {} // Données vierges
        };

        this.data.profiles.push(newProfile);
        this.save();
        console.log("[SCCS Registre] Profil créé :", newId);
        return newId;
    },

    /**
     * Met à jour les données d'un profil (appelé par la Fiche lors de la saisie)
     * @param {string} id - ID du profil
     * @param {Object} contentData - L'objet JSON contenant toutes les valeurs des inputs
     * @param {string} [name] - (Optionnel) Le nom du personnage pour le sommaire
     */
    updateProfile: function(id, contentData, name) {
        const profile = this.data.profiles.find(p => p.id === id);
        if (profile) {
            profile.content = contentData;
            if (name) profile.name = name;
            profile.timestamp = Date.now();
            this.save();
            // console.log("[SCCS Registre] Profil sauvegardé :", id); // Décommenter pour debug
        } else {
            console.warn("[SCCS Registre] Tentative de sauvegarde sur un profil inexistant :", id);
        }
    },

    /**
     * Supprime définitivement un profil (appelé par le Livre)
     * @param {string} id - ID du profil à supprimer
     * @returns {boolean} Succès de l'opération
     */
    deleteProfile: function(id) {
        const index = this.data.profiles.findIndex(p => p.id === id);
        if (index > -1) {
            this.data.profiles.splice(index, 1);
            this.save();
            console.log("[SCCS Registre] Profil supprimé :", id);
            return true;
        }
        return false;
    },

    /**
     * Écrit les données physiquement dans le LocalStorage
     */
    save: function() {
        try {
            const json = JSON.stringify(this.data);
            localStorage.setItem(this.STORAGE_KEY, json);
        } catch (e) {
            console.error("[SCCS Registre] Erreur critique lors de l'écriture disque :", e);
            alert("Attention : Impossible de sauvegarder (Quota dépassé ?)");
        }
    },

        /**
     * Force la relecture du LocalStorage pour synchroniser l'état entre iframe et parent
     */
    reload: function() {
        const store = localStorage.getItem(this.STORAGE_KEY);
        if (store) {
            try {
                this.data = JSON.parse(store);
            } catch (e) {
                console.error("[SCCS Registre] Erreur de relecture des données :", e);
            }
        }
    },
    
    /**
     * Fonction utilitaire pour exporter tout le registre en JSON (Backup global)
     */
    exportGlobalBackup: function() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `SCCS_Registre_Complet_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Auto-initialisation au chargement du script
SCCS_Registre.init();
