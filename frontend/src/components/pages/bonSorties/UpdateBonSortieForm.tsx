import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import useBonSortieDetails from '../../../services/bonSorties/useBonSortieDetails';
import DateInput from '../../common/DateInput';
import SelectionList from '../../common/SelectionList';
import { Employer } from '../../../models/employerType';
import useEmployers from '../../../services/employers/useEmployers';
import ArticleSelection from '../../common/ArticleSelection';
import useFetchArticles from '../../../services/article/usefetchArticles';
import { Sortie } from '../../../models/sortieType';
import { Article } from '../../../models/articleTypes';
import { BonSortie } from '../../../models/bonSortieType';
import { Service } from '../../../models/serviceTypes';
import useService from '../../../services/a_services/useServices';
import SelectedArticlesTable from '../../common/SelectedArticlesTable';
import SearchInput from '../../common/SearchInput';
import { Bk_End_SRVR } from '../../../configs/conf';

type Props = {
  id: number;
  onClose: () => void;
  fetchBonSorties: () => void;
};

const UpdateBonSortieForm: React.FC<Props> = ({ id, onClose, fetchBonSorties }) => {
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [selectedSorties, setSelectedSorties] = useState<Sortie[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [employerSearchTerm, setEmployerSearchTerm] = useState('');
  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  
  // Initialize form fields once the data is available
  const [bonSortie, setBonSortie] = useState<BonSortie | null>(null);

  // Fetching bonSortie details and other data
  const { bonSortie: fetchedBonSortie, mapSorties, loading, error } = useBonSortieDetails(id);
  const { employers } = useEmployers();
  const { articles } = useFetchArticles();
  const { services } = useService();

  // Initialize form state once the fetched bonSortie is available
  useEffect(() => {
    if (fetchedBonSortie) {
      setBonSortie(fetchedBonSortie);
      const employer = employers.find((e) => e.id === fetchedBonSortie.id_employeur);
      setSelectedEmployer(employer || null);
      
      const service = services.find((e) => e.id === fetchedBonSortie.id_service);
      setSelectedService(service || null);

      setSelectedSorties(
        mapSorties.map((sortie: any) => ({
          idArticle: sortie.id_article,
          quantity: sortie.quantity,
          idBs: sortie.id_bs,
        }))
      );
    }
  }, [fetchedBonSortie, employers, mapSorties, services]); // Re-run when bonSortie, employers, or services data changes

  // Sync selectedSorties changes to bonSortie
  useEffect(() => {
    if (bonSortie) {
      setBonSortie((prevBonSortie) => ({
        ...prevBonSortie!,
        sorties: selectedSorties,
      }));
    }
  }, [selectedSorties]); // Triggered when selectedSorties change

  const filteredEmployers = employers.filter((employer) =>
    employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase()) ||
    employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
  );

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(articleSearchTerm.toLowerCase())
  );

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  const handleSortieChange = <K extends keyof Sortie>(index: number, field: K, value: Sortie[K]) => {
    setSelectedSorties((prevSorties) => {
      const updatedSorties = [...prevSorties];
      updatedSorties[index] = { ...updatedSorties[index], [field]: value ?? 0 };
      return updatedSorties;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');
      if (!bonSortie) {
        console.error('No bonSortie data available to update.');
        return;
      }
  /**
   *     id: number;
    id_employeur: number;
    id_service: number;
    date: string;
   */
      // Ensure the updated 'selectedSorties' are synced into 'bonSortie'
      const updatedBonSortie = {
        ...bonSortie,
        sorties: selectedSorties,  // Ensure we send the latest 'selectedSorties'
        id_employeur: selectedEmployer?.id,  // Only update if employer was changed
        id_service:selectedService?.id,

       
      };
  
      // Send the updated bonSortie to the server
      const response = await fetch(`${Bk_End_SRVR}:5000/api/bonsorties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedBonSortie),
      });
  
      if (!response.ok) throw new Error('Failed to update Bon Sortie.');
      fetchBonSorties(); // Refresh data after updating
      onClose(); // Close the form
    } catch (err) {
      console.error(err);
    }
  }
  

  const handleArticleSelect = (article: Article) => {
    setSelectedSorties((prevSorties) => {
      const newEntries = new Map(prevSorties.map((s) => [s.idArticle, s]));
      newEntries.has(article.id!)
        ? newEntries.delete(article.id!)
        : newEntries.set(article.id!, { idArticle: article.id!, quantity: 1, idBs: id });
      return Array.from(newEntries.values());
    });
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!bonSortie) {
      console.error('No bonSortie data available to update.');
      return;
    }

    const { name, value } = e.target;
    setBonSortie((prevBonSortie) => {
      if (!prevBonSortie) return null;
      return {
        ...prevBonSortie,
        [name]: value,
      } as BonSortie;
    });
  }

  return (
    <>
      <Modal isOpen={true} onClose={onClose} title="تحديث وصل خروج">
        {loading ? (
          <div className="loading-container">
            <p>جارٍ تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="text-danger">{`حدث خطأ: ${error}`}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Date Input: Ensure it's populated with the correct initial date */}
            <DateInput 
              label="التاريخ" 
              name="date" 
              value={bonSortie?.date?.split('T')[0] || ''} 
              onChange={handleChange} 
            />
  
            {/* Employer Search and Selection */}
            <SearchInput 
              placeholder="البحث عن موظف" 
              value={employerSearchTerm} 
              onChange={(e) => setEmployerSearchTerm(e.target.value)} 
            />
            <SelectionList
              items={filteredEmployers}
              selectedItem={selectedEmployer}
              onSelect={(employer) => setSelectedEmployer(employer)}
              getItemLabel={(employer) => `${employer.fname} ${employer.lname}`}
              emptyMessage="لا يوجد موظفون متاحون"
            />
  
            {/* Service Search and Selection */}
            <SearchInput 
              placeholder="البحث عن خدمة" 
              value={serviceSearchTerm} 
              onChange={(e) => setServiceSearchTerm(e.target.value)} 
            />
            <SelectionList
              items={filteredServices}
              selectedItem={selectedService}
              onSelect={(service) => setSelectedService(service)}
              getItemLabel={(service) => service.name}
              emptyMessage="لا يوجد مصالح متاحون"
            />
  
            {/* Article Search and Selection */}
            <SearchInput 
              placeholder="البحث عن مادة" 
              value={articleSearchTerm} 
              onChange={(e) => setArticleSearchTerm(e.target.value)} 
            />
            <ArticleSelection
              articles={filteredArticles}
              selectedEntrees={selectedSorties}
              onArticleSelect={handleArticleSelect}
            />
  
            {/* Table to display selected articles */}
            <SelectedArticlesTable
              selectedItems={selectedSorties}
              articles={articles}
              onItemChange={handleSortieChange}
            />
  
            {/* Footer Buttons */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">تحديث</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
  
};

export default UpdateBonSortieForm;
