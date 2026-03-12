// Clase principal de IronDash
class IronDash {
    constructor() {
        this.init();
    }

    init() {
        this.setupMouseTracking();
        this.setupPanelInteractions();
        this.setupControls();
        this.setupChart();
        this.setupNotifications();
        this.createCustomCursor();
        this.animateChart();
    }

    // Seguimiento del ratón para efecto 3D
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            const hud = document.querySelector('.iron-hud');
            const rotateY = x * 5;
            const rotateX = -y * 5;
            
            hud.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Actualizar cursor personalizado
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.left = e.clientX - 10 + 'px';
                cursor.style.top = e.clientY - 10 + 'px';
                cursor.style.transform = `scale(${1 + Math.abs(x) * 0.1}, ${1 + Math.abs(y) * 0.1})`;
            }
        });

        // Efecto de hover en paneles
        const panels = document.querySelectorAll('.hud-panel');
        panels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                panel.style.transform = panel.style.transform + ' scale(1.02)';
            });
            
            panel.addEventListener('mouseleave', () => {
                panel.style.transform = panel.style.transform.replace(' scale(1.02)', '');
            });
        });
    }

    // Interacciones de los paneles
    setupPanelInteractions() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showDetail(card);
            });
        });

        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            item.addEventListener('click', () => {
                this.markAsComplete(item);
            });
        });

        const shortcutItems = document.querySelectorAll('.shortcut-item');
        shortcutItems.forEach(item => {
            item.addEventListener('click', () => {
                this.activateShortcut(item);
            });
        });
    }

    // Controles del HUD
    setupControls() {
        const fullscreenBtn = document.getElementById('toggleFullscreen');
        const vrBtn = document.getElementById('toggleVR');
        const darkModeBtn = document.getElementById('toggleDarkMode');

        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        vrBtn.addEventListener('click', () => {
            this.toggleVRMode();
        });

        darkModeBtn.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Botones del gráfico
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                chartBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateChart(btn.textContent);
            });
        });
    }

    // Crear cursor personalizado
    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
    }

    // Configurar gráfico
    setupChart() {
        this.chartData = {
            ventas: [65, 78, 92, 88, 95, 102, 98],
            clientes: [45, 52, 58, 65, 72, 78, 85],
            ganancias: [80, 85, 90, 88, 92, 95, 93]
        };
        
        this.currentChart = 'ventas';
        this.renderChart();
    }

    // Renderizar gráfico
    renderChart() {
        const chart = document.getElementById('performanceChart');
        chart.innerHTML = '';
        
        const data = this.chartData[this.currentChart];
        const maxValue = Math.max(...data);
        const chartWidth = chart.offsetWidth;
        const barWidth = chartWidth / data.length * 0.8;
        const spacing = chartWidth / data.length * 0.2;
        
        data.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.left = `${index * (barWidth + spacing) + spacing/2}px`;
            bar.style.height = `${(value / maxValue) * 150}px`;
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][index];
            label.style.left = `${index * (barWidth + spacing) + spacing/2}px`;
            
            const valueLabel = document.createElement('div');
            valueLabel.className = 'value-label';
            valueLabel.textContent = value;
            valueLabel.style.left = `${index * (barWidth + spacing) + spacing/2}px`;
            
            chart.appendChild(bar);
            chart.appendChild(label);
            chart.appendChild(valueLabel);
        });
    }

    // Animación del gráfico
    animateChart() {
        setInterval(() => {
            const data = this.chartData[this.currentChart];
            const bars = document.querySelectorAll('.bar');
            
            bars.forEach((bar, index) => {
                const newValue = data[index] + (Math.random() - 0.5) * 5;
                const maxValue = Math.max(...data);
                bar.style.height = `${(newValue / maxValue) * 150}px`;
                bar.querySelector('.value-label').textContent = Math.round(newValue);
            });
        }, 2000);
    }

    // Actualizar gráfico
    updateChart(type) {
        this.currentChart = type.toLowerCase();
        this.renderChart();
    }

    // Mostrar detalle de métrica
    showDetail(card) {
        const metricName = card.querySelector('.metric-header span').textContent;
        const metricValue = card.querySelector('.metric-value').textContent;
        
        this.showNotification(`Detalles de ${metricName}: ${metricValue}`, 3000);
    }

    // Marcar tarea como completada
    markAsComplete(taskItem) {
        taskItem.style.opacity = '0.5';
        taskItem.style.textDecoration = 'line-through';
        this.showNotification('Tarea marcada como completada', 2000);
    }

    // Activar atajo
    activateShortcut(shortcut) {
        const shortcutName = shortcut.querySelector('span').textContent;
        this.showNotification(`Activando: ${shortcutName}`, 2000);
    }

    // Controles del HUD
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    toggleVRMode() {
        const hud = document.querySelector('.iron-hud');
        hud.classList.toggle('vr-mode');
        this.showNotification(hud.classList.contains('vr-mode') ? 'Modo VR Activado' : 'Modo VR Desactivado', 2000);
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        this.showNotification(document.body.classList.contains('dark-mode') ? 'Modo Oscuro Activado' : 'Modo Oscuro Desactivado', 2000);
    }

    // Configurar notificaciones
    setupNotifications() {
        // Simular notificaciones nuevas
        setInterval(() => {
            const notifications = [
                { icon: 'fas fa-bell', title: 'Nueva venta registrada', time: '2 min' },
                { icon: 'fas fa-envelope', title: 'Correo de cliente', time: '15 min' },
                { icon: 'fas fa-chart-bar', title: 'Reporte mensual listo', time: '1 hora' },
                { icon: 'fas fa-shopping-cart', title: 'Pedido confirmado', time: '30 min' },
                { icon: 'fas fa-user-plus', title: 'Nuevo cliente', time: '45 min' }
            ];
            
            const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
            this.addNotification(randomNotif);
        }, 10000);
    }

    addNotification(notif) {
        const notificationPanel = document.querySelector('.notification-panel .panel-content');
        const existingNotifs = notificationPanel.querySelectorAll('.notification-item');
        
        // Limitar a 5 notificaciones
        if (existingNotifs.length >= 5) {
            existingNotifs[existingNotifs.length - 1].remove();
        }
        
        const notifElement = document.createElement('div');
        notifElement.className = 'notification-item new';
        notifElement.innerHTML = `
            <i class="fas ${notif.icon}"></i>
            <div>
                <div class="notification-title">${notif.title}</div>
                <div class="notification-time">${notif.time}</div>
            </div>
        `;
        
        notificationPanel.insertBefore(notifElement, notificationPanel.firstChild);
        
        // Eliminar después de 5 segundos
        setTimeout(() => {
            notifElement.remove();
        }, 5000);
    }

    // Mostrar notificación
    showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        notification.style.color = 'white';
        notification.style.padding = '1rem 2rem';
        notification.style.borderRadius = '50px';
        notification.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.5)';
        notification.style.zIndex = '10000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new IronDash();
});
