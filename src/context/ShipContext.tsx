import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Ship, Component } from '../types';
import { getShips, saveShips, getComponents, saveComponents, generateId } from '../utils/storage';

interface ShipContextType {
  ships: Ship[];
  components: Component[];
  addShip: (ship: Omit<Ship, 'id' | 'components'>) => void;
  updateShip: (id: string, ship: Partial<Ship>) => void;
  deleteShip: (id: string) => void;
  addComponent: (component: Omit<Component, 'id'>) => void;
  updateComponent: (id: string, component: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  getShipComponents: (shipId: string) => Component[];
}

const ShipContext = createContext<ShipContextType | undefined>(undefined);

export const ShipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [components, setComponents] = useState<Component[]>([]);

  useEffect(() => {
    // Load initial data from localStorage
    setShips(getShips());
    setComponents(getComponents());
  }, []);

  const addShip = (shipData: Omit<Ship, 'id' | 'components'>) => {
    const newShip: Ship = {
      ...shipData,
      id: generateId(),
      components: []
    };
    const updatedShips = [...ships, newShip];
    setShips(updatedShips);
    saveShips(updatedShips);
  };

  const updateShip = (id: string, shipData: Partial<Ship>) => {
    const updatedShips = ships.map(ship =>
      ship.id === id ? { ...ship, ...shipData } : ship
    );
    setShips(updatedShips);
    saveShips(updatedShips);
  };

  const deleteShip = (id: string) => {
    const updatedShips = ships.filter(ship => ship.id !== id);
    setShips(updatedShips);
    saveShips(updatedShips);
    
    // Also remove all components associated with this ship
    const updatedComponents = components.filter(component => component.shipId !== id);
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
  };

  const addComponent = (componentData: Omit<Component, 'id'>) => {
    const newComponent: Component = {
      ...componentData,
      id: generateId()
    };
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
  };

  const updateComponent = (id: string, componentData: Partial<Component>) => {
    const updatedComponents = components.map(component =>
      component.id === id ? { ...component, ...componentData } : component
    );
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
  };

  const deleteComponent = (id: string) => {
    const updatedComponents = components.filter(component => component.id !== id);
    setComponents(updatedComponents);
    saveComponents(updatedComponents);
  };

  const getShipComponents = (shipId: string) => {
    return components.filter(component => component.shipId === shipId);
  };

  return (
    <ShipContext.Provider
      value={{
        ships,
        components,
        addShip,
        updateShip,
        deleteShip,
        addComponent,
        updateComponent,
        deleteComponent,
        getShipComponents
      }}
    >
      {children}
    </ShipContext.Provider>
  );
};

export const useShips = () => {
  const context = useContext(ShipContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipProvider');
  }
  return context;
}; 