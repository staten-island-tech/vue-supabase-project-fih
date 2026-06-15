<template style="width: 100%; height: 100%;">
    <div class="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat relative" :style="{ backgroundImage: `url('https://cdn.vectorstock.com/i/500p/26/43/coral-reef-aquarium-background-vector-50352643.jpg')` }">
        <GoBackButton style="position: absolute; top: 10px; left: 10px;"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style="position: absolute; bottom: 10px; left: 10px;" v-show="showVisitFunctionbtn" @click="toggleVisitFunction">Visit Other Aquariums!</button>
        <VisitFunction v-show="showVisitFunction"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style="position: absolute; top: 10px; right: 10px;" v-show="showUserProfilebtn" @click="toggleUserProfile">User Profile</button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style="position: absolute; bottom: 10px; right: 10px;" @click="goToPixel">Create Fish</button>
        <UserProfile class="user-profile-panel" v-show="showUserProfile" @close="toggleUserProfile"/>

        <div class="aquarium-fish-layer">
            <div v-if="fish.length" class="aquarium-container">
                <div
                    v-for="f in fish"
                    :key="f.id"
                    class="fish-wrapper"
                    :style="f.style"
                >
                    <img :src="f.publicUrl" class="aquarium-fish" alt="Saved fish" @click="openFish(f)" />
                </div>
            </div>
            <div v-else class="empty-fish">No fish yet — create one!</div>
        </div>

        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
            <div class="fish-card">
                <button class="close" @click="closeModal">✕</button>
                <img :src="selectedFish.publicUrl" class="card-img" />
                <h3 class="card-name">{{ selectedFish.name || 'Unnamed fish' }}</h3>
                <p class="card-desc">{{ selectedFish.description || 'No description' }}</p>
                <div class="card-actions">
                    <button class="edit-btn" @click="editFish">Edit</button>
                    <button class="delete-btn" @click="deleteFish">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useSupabaseUser } from '#imports';

const showVisitFunctionbtn = ref(true);
const showUserProfilebtn = ref(true);
const showVisitFunction = ref(false);
const showUserProfile = ref(false);
const fish = ref([]);
const selectedFish = ref(null);
const showModal = ref(false);
const router = useRouter();
const user = useSupabaseUser();

function toggleVisitFunction() {
    showVisitFunction.value = !showVisitFunction.value;
    showUserProfile.value = false;
}
function toggleUserProfile() {
    showUserProfile.value = !showUserProfile.value;
    showVisitFunction.value = false;
}

function goToPixel() {
    router.push('/PixelArtFish');
}

const loadFish = () => {
    const userId = user.value?.id || 'anon';
    const key = `aquarium-fish-${userId}`;
    try {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        fish.value = (list || []).map(item => ({
            ...item,
            style: randomStyle()
        }));
    } catch (e) {
        console.warn('Error loading aquarium fish', e);
        fish.value = [];
    }
}

const randomStyle = () => {
    const left = Math.floor(5 + Math.random() * 80);
    const top = Math.floor(10 + Math.random() * 70);
    const dur = Math.floor(6 + Math.random() * 6);
    return `position:absolute; left:${left}%; top:${top}%; transform:translate(-50%,-50%); animation: swim ${dur}s ease-in-out infinite alternate;`;
}

const openFish = (f) => {
    selectedFish.value = f;
    showModal.value = true;
}

const closeModal = () => {
    selectedFish.value = null;
    showModal.value = false;
}

const editFish = () => {
    if (!selectedFish.value) return;
    router.push({ path: '/FishDescription', query: { savedFishId: selectedFish.value.id } });
}

const deleteFish = () => {
    if (!selectedFish.value) return;
    const userId = user.value?.id || 'anon';
    const key = `aquarium-fish-${userId}`;

    try {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const updatedList = list.filter(
            item => String(item.id) !== String(selectedFish.value.id)
        );
        localStorage.setItem(key, JSON.stringify(updatedList));
        fish.value = fish.value.filter(
            item => String(item.id) !== String(selectedFish.value.id)
        );
    } catch (e) {
        console.warn('Error deleting fish', e);
    }

    closeModal();
}

onMounted(loadFish);
</script>

<style scoped>
.aquarium-fish-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
}
.aquarium-container {
    position: relative;
    width: 100%;
    height: 100%;
}
.aquarium-fish {
    width: 80px;
    height: auto;
    pointer-events: auto;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    cursor: pointer;
}
.empty-fish {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0,0,0,0.6);
}
.modal-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.4);
    z-index: 40;
}
.user-profile-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 50;
}
.fish-card {
    background: white;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    width: 320px;
    max-width: 90%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    position: relative;
    text-align: center;
}
.fish-card .close {
    position: absolute;
    right: 8px;
    top: 8px;
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
}
.fish-card .card-img {
    width: 180px;
    height: auto;
    display: block;
    margin: 0.5rem auto;
}
.fish-card .card-name {
    margin: 0.25rem 0;
}
.fish-card .card-desc {
    color: #444;
    font-size: 14px;
}
.card-actions {
    margin-top: 0.75rem;
    display: flex;
    justify-content: center;
}
.edit-btn,
.delete-btn {
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}
.edit-btn {
    background: #06b6d4;
}
.delete-btn {
    background: #ef4444;
    margin-left: 0.75rem;
}
.edit-btn:hover,
.delete-btn:hover {
    opacity: 0.95;
}
@keyframes swim {
    from { transform: translate(-50%,-50%) translateX(-8px); }
    to { transform: translate(-50%,-50%) translateX(8px); }
}
</style>